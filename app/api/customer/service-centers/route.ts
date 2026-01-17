import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ServiceCenter } from '@/lib/types';

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate ranking score
function calculateRankingScore(
  distance: number,
  rating: number | undefined,
  lastVerifiedAt: string | null | undefined
): number {
  // Normalize distance score (0-1, where closer = higher)
  // Assume max distance of 50km for normalization
  const maxDistance = 50;
  const distanceScore = Math.max(0, 1 - (distance / maxDistance));

  // Normalize rating score (0-1, where 5 stars = 1.0)
  const maxRating = 5;
  const ratingScore = rating ? (rating / maxRating) : 0.5; // Default to 0.5 if no rating

  // Calculate recency score (0-1, where more recent = higher)
  let recencyScore = 0.5; // Default
  if (lastVerifiedAt) {
    const verifiedDate = new Date(lastVerifiedAt);
    const now = new Date();
    const daysSinceVerification = (now.getTime() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24);
    // If verified within 90 days, score is high, otherwise decreases
    recencyScore = Math.max(0, 1 - (daysSinceVerification / 90));
  }

  // Weighted scoring: distance 40%, rating 40%, recency 20%
  const score = (distanceScore * 0.4) + (ratingScore * 0.4) + (recencyScore * 0.2);
  return score;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get customer profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('customer_mobile, role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'CUSTOMER' || !profile.customer_mobile) {
      return NextResponse.json(
        { error: 'Invalid customer profile' },
        { status: 403 }
      );
    }

    // Get product information from query params
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const pincode = searchParams.get('pincode');
    const city = searchParams.get('city');
    const brand = searchParams.get('brand');
    const productCategory = searchParams.get('productCategory');
    const warrantyActive = searchParams.get('warrantyActive') === 'true';
    const amcActive = searchParams.get('amcActive') === 'true';
    const customerLat = searchParams.get('latitude') ? parseFloat(searchParams.get('latitude')!) : null;
    const customerLng = searchParams.get('longitude') ? parseFloat(searchParams.get('longitude')!) : null;

    // Get customer's product to extract location if needed
    let customerPincode = pincode;
    let customerCity = city;
    let customerLatitude = customerLat;
    let customerLongitude = customerLng;

    if (productId) {
      const { data: product } = await supabase
        .from('customer_products')
        .select('pincode, city')
        .eq('id', productId)
        .eq('customer_mobile', profile.customer_mobile)
        .single();

      if (product) {
        customerPincode = customerPincode || product.pincode;
        customerCity = customerCity || product.city;
      }
    }

    // Normalize pincode and city (trim and handle case)
    const normalizedPincode = customerPincode ? String(customerPincode).trim() : null;
    const normalizedCity = customerCity ? String(customerCity).trim() : null;

    // Debug logging (can be removed in production)
    console.log('Service Center Search:', {
      productId,
      normalizedPincode,
      normalizedCity,
      warrantyActive,
      amcActive,
      brand,
      productCategory,
    });

    // Build query for service centers
    let query = supabase
      .from('service_centers')
      .select('*')
      .eq('active_status', true);

    // Filter by pincode first, then city as fallback
    // Use case-insensitive matching for city
    if (normalizedPincode) {
      query = query.eq('pincode', normalizedPincode);
      console.log('Filtering by pincode:', normalizedPincode);
    } else if (normalizedCity) {
      // For city, we'll use ilike for case-insensitive matching
      // But Supabase PostgREST doesn't support ilike directly in JS client
      // So we'll filter after fetching if needed
      query = query.eq('city', normalizedCity);
      console.log('Filtering by city:', normalizedCity);
    } else {
      console.log('Warning: No pincode or city provided for filtering');
    }

    // Filter by warranty support if warranty is active
    if (warrantyActive) {
      query = query.eq('warranty_supported', true);
      console.log('Filtering for warranty-supported centers only');
    }

    const { data: serviceCenters, error } = await query;

    if (error) {
      console.error('Service Center Query Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch service centers', details: error.message },
        { status: 500 }
      );
    }

    // Log results for debugging
    console.log('Service Centers Found:', serviceCenters?.length || 0);

    // If no exact match, try case-insensitive city matching
    let filteredCenters = serviceCenters || [];
    if (filteredCenters.length === 0 && normalizedCity) {
      // Try to fetch all active centers and filter client-side for case-insensitive city match
      const { data: allActiveCenters } = await supabase
        .from('service_centers')
        .select('*')
        .eq('active_status', true);

      if (allActiveCenters) {
        filteredCenters = allActiveCenters.filter(
          (sc: any) => sc.city && sc.city.toLowerCase() === normalizedCity.toLowerCase()
        );
        console.log('Case-insensitive city match found:', filteredCenters.length);
      }
    }

    if (!filteredCenters || filteredCenters.length === 0) {
      // Fallback: if no warranty-supported centers found and warranty is active, show non-warranty centers
      if (warrantyActive) {
        let fallbackQuery = supabase
          .from('service_centers')
          .select('*')
          .eq('active_status', true);

        if (normalizedPincode) {
          fallbackQuery = fallbackQuery.eq('pincode', normalizedPincode);
        } else if (normalizedCity) {
          fallbackQuery = fallbackQuery.eq('city', normalizedCity);
        }

        const { data: fallbackCenters } = await fallbackQuery;

        // If still no results, try case-insensitive city match
        if (!fallbackCenters || (fallbackCenters.length === 0 && normalizedCity)) {
          const { data: allActiveCenters } = await supabase
            .from('service_centers')
            .select('*')
            .eq('active_status', true);

          if (allActiveCenters) {
            filteredCenters = allActiveCenters.filter(
              (sc: any) => sc.city && sc.city.toLowerCase() === normalizedCity.toLowerCase()
            );
          }
        } else {
          filteredCenters = fallbackCenters;
        }

        if (filteredCenters && filteredCenters.length > 0) {
          return NextResponse.json({
            serviceCenters: filteredCenters.map(sc => ({
              ...sc,
              distance_km: null,
              ranking_score: 0.5,
            })),
            recommendations: [],
            message: 'Showing alternative service centers (warranty not supported)',
          });
        }
      }

      // Log what we searched for
      console.log('No service centers found for:', { normalizedPincode, normalizedCity });
      return NextResponse.json({
        serviceCenters: [],
        recommendations: [],
        message: 'No service centers found in your area',
      });
    }

    // Calculate distances and ranking scores
    const centersWithScores: (ServiceCenter & { distance_km?: number; ranking_score: number })[] = filteredCenters.map((sc: any) => {
      let distance = null;
      
      // Calculate distance if both customer and service center have coordinates
      if (customerLatitude && customerLongitude && sc.latitude && sc.longitude) {
        distance = calculateDistance(
          customerLatitude,
          customerLongitude,
          sc.latitude,
          sc.longitude
        );
      }

      // Calculate ranking score
      const rankingScore = calculateRankingScore(
        distance || 25, // Default to 25km if no distance
        sc.rating,
        sc.last_verified_at
      );

      return {
        ...sc,
        distance_km: distance,
        ranking_score: rankingScore,
      };
    });

    // Filter by brand and category for recommendations
    const recommendedCenters = centersWithScores
      .filter(sc => {
        const brandMatch = brand && sc.supported_brands
          ? sc.supported_brands.some((b: string) => b.toLowerCase().includes(brand.toLowerCase()))
          : true;
        
        const categoryMatch = productCategory && sc.supported_categories
          ? sc.supported_categories.some((c: string) => c.toLowerCase().includes(productCategory.toLowerCase()))
          : true;

        return brandMatch && categoryMatch;
      })
      .sort((a, b) => b.ranking_score - a.ranking_score)
      .slice(0, 3);

    // Sort all centers by ranking score
    const sortedCenters = centersWithScores.sort((a, b) => b.ranking_score - a.ranking_score);

    // Prioritize AMC-supported centers if AMC is active
    if (amcActive) {
      sortedCenters.sort((a, b) => {
        if (a.amc_supported && !b.amc_supported) return -1;
        if (!a.amc_supported && b.amc_supported) return 1;
        return b.ranking_score - a.ranking_score;
      });
    }

    return NextResponse.json({
      serviceCenters: sortedCenters,
      recommendations: recommendedCenters,
    });
  } catch (error) {
    console.error('Service centers API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * FavoriteAnalytics Component
 * Admin dashboard component for viewing favorite analytics and trends
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, TrendingUp, Users, Eye, Loader2, Calendar } from 'lucide-react';
import { favoritesService } from '@/app/services';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';

const FavoriteAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [mostFavorited, setMostFavorited] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [categoryFilter, setCategoryFilter] = useState('');

  // Check if user has admin permissions
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
      fetchMostFavorited();
    }
  }, [isAdmin, timeRange, categoryFilter]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString();

      const response = await favoritesService.getFavoriteAnalytics({
        startDate,
        endDate
      });

      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching favorite analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchMostFavorited = async () => {
    try {
      const params = {
        limit: 10,
        ...(categoryFilter && { categoryId: parseInt(categoryFilter) })
      };

      if (timeRange !== 'all') {
        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString();
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const response = await favoritesService.getMostFavorited(params);

      if (response.success) {
        setMostFavorited(response.data.listings);
      }
    } catch (error) {
      console.error('Error fetching most favorited listings:', error);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Access denied. Admin permissions required.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Favorite Analytics</h2>
          <p className="text-gray-600">Track user engagement and popular listings</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={() => {
              fetchAnalytics();
              fetchMostFavorited();
            }}
            disabled={loading}
            size="sm"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Favorites</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.totalFavorites?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.uniqueUsers?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Favorited Listings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.uniqueListings?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg per User</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {parseFloat(analytics.avgFavoritesPerUser || 0).toFixed(1)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Most Favorited Listings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Most Favorited Listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          ) : mostFavorited.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No data available for the selected period</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mostFavorited.map((item, index) => (
                <div
                  key={item.listingId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {item.listing?.title || `Listing #${item.listingId}`}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          ID: {item.listingId}
                        </Badge>
                        {item.listing?.status && (
                          <Badge 
                            variant={item.listing.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {item.listing.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-red-600">
                      <Heart className="h-4 w-4 fill-current" />
                      <span className="font-bold">{item.favoriteCount}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">favorites</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analytics Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Understanding the Metrics</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>Total Favorites:</strong> All favorite actions in the period</li>
                <li>• <strong>Active Users:</strong> Users who favorited at least one listing</li>
                <li>• <strong>Favorited Listings:</strong> Unique listings that received favorites</li>
                <li>• <strong>Avg per User:</strong> Average favorites per active user</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Optimization Tips</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Monitor trending listings for promotion opportunities</li>
                <li>• High favorite counts indicate quality listings</li>
                <li>• Low engagement may suggest content quality issues</li>
                <li>• Use data to improve recommendation algorithms</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoriteAnalytics;
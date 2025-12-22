/**
 * FavoritesDebugger Component
 * Debug component to test favorites API integration
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { favoritesService } from '@/app/services';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';

const FavoritesDebugger = () => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const testAddFavorite = async () => {
    setLoading(true);
    try {
      console.log('🔄 Testing Add to Favorites API...');
      const response = await favoritesService.addToFavorites(12345);
      console.log('✅ Add Favorite Response:', response);
      setResults(prev => ({ ...prev, add: response }));
      toast.success('Add favorite test completed - check console');
    } catch (error) {
      console.error('❌ Add Favorite Error:', error);
      setResults(prev => ({ ...prev, addError: error }));
      toast.error(`Add favorite failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCheckFavorite = async () => {
    setLoading(true);
    try {
      console.log('🔄 Testing Check Favorite API...');
      const response = await favoritesService.checkIsFavorited(12345);
      console.log('✅ Check Favorite Response:', response);
      setResults(prev => ({ ...prev, check: response }));
      toast.success('Check favorite test completed - check console');
    } catch (error) {
      console.error('❌ Check Favorite Error:', error);
      setResults(prev => ({ ...prev, checkError: error }));
      toast.error(`Check favorite failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetFavorites = async () => {
    setLoading(true);
    try {
      console.log('🔄 Testing Get Favorites API...');
      const response = await favoritesService.getUserFavorites();
      console.log('✅ Get Favorites Response:', response);
      setResults(prev => ({ ...prev, list: response }));
      toast.success('Get favorites test completed - check console');
    } catch (error) {
      console.error('❌ Get Favorites Error:', error);
      setResults(prev => ({ ...prev, listError: error }));
      toast.error(`Get favorites failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50">
        <h3 className="font-semibold text-yellow-800">Favorites API Debugger</h3>
        <p className="text-yellow-700">Please login to test favorites API</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-blue-50">
      <h3 className="font-semibold text-blue-800 mb-4">Favorites API Debugger</h3>
      
      <div className="mb-4">
        <p className="text-sm text-blue-700">
          User: {user?.name} ({user?.email})
        </p>
        <p className="text-sm text-blue-700">
          Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api'}
        </p>
      </div>

      <div className="space-y-2 mb-4">
        <Button 
          onClick={testCheckFavorite} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          Test Check Favorite (ID: 12345)
        </Button>
        
        <Button 
          onClick={testAddFavorite} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          Test Add Favorite (ID: 12345)
        </Button>
        
        <Button 
          onClick={testGetFavorites} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          Test Get Favorites List
        </Button>
      </div>

      {results && (
        <div className="mt-4 p-3 bg-white rounded border">
          <h4 className="font-medium mb-2">Test Results:</h4>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 text-xs text-blue-600">
        <p>• Open browser DevTools → Network tab to see API calls</p>
        <p>• Check console for detailed logs</p>
        <p>• Make sure backend server is running on port 5000</p>
      </div>
    </div>
  );
};

export default FavoritesDebugger;
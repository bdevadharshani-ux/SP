import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestApi, donorApi, analyticsApi } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { DashboardLayout } from '../components/DashboardLayout';
import { FulfillRequestModal } from '../components/FulfillRequestModal';
import { 
  Heart, 
  Search, 
  MapPin, 
  Clock,
  Package,
  TrendingUp,
  AlertTriangle,
  Filter,
  Building2,
  Utensils,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const DONOR_TYPES = [
  { value: 'restaurant', label: 'Restaurants & Cafés', icon: Utensils },
  { value: 'hotel', label: 'Hotels & Catering Services', icon: Building2 },
  { value: 'event', label: 'Marriage Halls & Event Organizers', icon: Users },
  { value: 'corporate', label: 'Corporate Offices & College Canteens', icon: Building2 }
];

export const DonorDashboard = () => {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [fulfillments, setFulfillments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDonorTypeModal, setShowDonorTypeModal] = useState(false);
  const [donorType, setDonorType] = useState(null);
  const [donorTypeLoading, setDonorTypeLoading] = useState(false);
 const [filters, setFilters] = useState({
  search: '',
  foodType: 'all',
  dietType: 'all', // veg / non-veg
  urgency: 'all',
});
  const [userLocation, setUserLocation] = useState(null);

  // Check donor type on mount
  useEffect(() => {
    const checkDonorType = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/donor/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.data && response.data.donor_type) {
          setDonorType(response.data.donor_type);
        } else {
          setShowDonorTypeModal(true);
        }
      } catch (error) {
        // If profile doesn't exist or no donor_type, show modal
        setShowDonorTypeModal(true);
      }
    };

    if (user && user.role === 'donor') {
      checkDonorType();
    }
  }, [user, token]);

  const handleDonorTypeSubmit = async (selectedType) => {
    setDonorTypeLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/donor/profile`,
        { donor_type: selectedType },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setDonorType(selectedType);
      setShowDonorTypeModal(false);
      toast.success('Donor type saved successfully!');
    } catch (error) {
      console.error('Error saving donor type:', error);
      toast.error('Failed to save donor type. Please try again.');
    } finally {
      setDonorTypeLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const params = {};
      if (userLocation) {
        params.lat = userLocation.lat;
        params.lng = userLocation.lng;
      }
      
      const [reqRes, fulRes, anaRes] = await Promise.all([
        requestApi.getAll(params),
        donorApi.getFulfillments(),
        analyticsApi.getUser(),
      ]);
      
      setRequests(reqRes.data || []);
      setFulfillments(fulRes.data || []);
      setAnalytics(anaRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log('Location permission denied');
        }
      );
    }
  }, []);

  useEffect(() => {
    if (donorType) {
      fetchData();
    }
  }, [fetchData, donorType]);

  const getUrgencyColor = (urgency) => {
    const colors = {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-green-500 text-white',
    };
    return colors[urgency] || colors.medium;
  };

  const filteredRequests = requests.filter(req => {
    if (filters.search && !req.ngo_name?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !req.address?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.foodType !== 'all' && req.food_type !== filters.foodType) {
      return false;
    }
    if (filters.urgency !== 'all' && req.urgency_level !== filters.urgency) {
      return false;
    }
    return true;
  });

  const getDonorTypeLabel = () => {
    const type = DONOR_TYPES.find(t => t.value === donorType);
    return type ? type.label : 'Donor';
  };

  if (loading || !donorType) {
    return (
      <DashboardLayout>
        <Dialog open={showDonorTypeModal} onOpenChange={setShowDonorTypeModal}>
          <DialogContent className=\"sm:max-w-md\">
            <DialogHeader>
              <DialogTitle className=\"font-heading text-2xl\">Select Your Donor Type</DialogTitle>
              <DialogDescription>
                Help us understand your organization better to provide tailored experience
              </DialogDescription>
            </DialogHeader>
            <div className=\"space-y-3 py-4\">
              {DONOR_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => handleDonorTypeSubmit(type.value)}
                    disabled={donorTypeLoading}
                    className=\"w-full p-4 rounded-xl border-2 border-stone-200 hover:border-primary hover:bg-primary/5 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed\"
                  >
                    <div className=\"flex items-center gap-3\">
                      <div className=\"p-2 bg-primary/10 rounded-lg\">
                        <Icon className=\"h-5 w-5 text-primary\" />
                      </div>
                      <span className=\"font-medium\">{type.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
        <div className=\"flex items-center justify-center h-64\">
          <div className=\"animate-pulse text-muted-foreground\">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className=\"space-y-8\" data-testid=\"donor-dashboard\">
        {/* Header */}
        <div>
          <h1 className=\"font-heading text-2xl sm:text-3xl font-bold text-foreground\">
            Donor Dashboard
          </h1>
          <p className=\"text-muted-foreground mt-1\">
            {getDonorTypeLabel()} • Browse and fulfill food requests from verified NGOs
          </p>
        </div>

        {/* Stats */}
        <div className=\"grid grid-cols-2 gap-4\">
          <Card className=\"border-stone-200\" data-testid=\"stat-donations\">
            <CardContent className=\"p-4\">
              <div className=\"flex items-center gap-3\">
                <div className=\"p-2 bg-accent/10 rounded-xl\">
                  <Heart className=\"h-5 w-5 text-accent\" />
                </div>
                <div>
                  <p className=\"text-2xl font-bold\">{analytics?.total_donations || 0}</p>
                  <p className=\"text-sm text-muted-foreground\">Total Donations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className=\"border-stone-200\" data-testid=\"stat-meals\">
            <CardContent className=\"p-4\">
              <div className=\"flex items-center gap-3\">
                <div className=\"p-2 bg-green-500/10 rounded-xl\">
                  <Package className=\"h-5 w-5 text-green-600\" />
                </div>
                <div>
                  <p className=\"text-2xl font-bold\">{analytics?.total_meals_donated || 0}</p>
                  <p className=\"text-sm text-muted-foreground\">Meals Donated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className=\"border-stone-200\">
          <CardContent className=\"p-4\">
            <div className=\"flex flex-col sm:flex-row gap-4\">
              <div className=\"relative flex-1\">
                <Search className=\"absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground\" />
                <Input
                  placeholder=\"Search by NGO or location...\"
                  className=\"pl-10\"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  data-testid=\"search-input\"
                />
              </div>
              <Select 
                value={filters.foodType} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, foodType: value }))}
              >
                <SelectTrigger className=\"w-full sm:w-40\" data-testid=\"food-type-filter\">
                  <SelectValue placeholder=\"Food Type\" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=\"all\">All Types</SelectItem>
                  <SelectItem value=\"cooked\">Cooked</SelectItem>
                  <SelectItem value=\"packaged\">Packaged</SelectItem>
                  <SelectItem value=\"raw\">Raw</SelectItem>
                  <SelectItem value=\"mixed\">Mixed</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={filters.urgency} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, urgency: value }))}
              >
                <SelectTrigger className=\"w-full sm:w-40\" data-testid=\"urgency-filter\">
                  <SelectValue placeholder=\"Urgency\" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=\"all\">All Urgency</SelectItem>
                  <SelectItem value=\"critical\">Critical</SelectItem>
                  <SelectItem value=\"high\">High</SelectItem>
                  <SelectItem value=\"medium\">Medium</SelectItem>
                  <SelectItem value=\"low\">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <Card className=\"border-stone-200\">
          <CardHeader>
            <CardTitle className=\"font-heading\">Available Requests</CardTitle>
            <CardDescription>
              {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} available
              {userLocation && ' • Sorted by distance'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className=\"text-center py-12\">
                <Package className=\"h-12 w-12 text-muted-foreground mx-auto mb-4\" />
                <p className=\"text-muted-foreground\">No requests match your filters</p>
              </div>
            ) : (
              <div className=\"space-y-4\">
                {filteredRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className=\"p-4 rounded-xl border border-stone-200 hover:bg-secondary/30 transition-all duration-200\"
                    data-testid={`request-${request.id}`}
                  >
                    <div className=\"flex flex-col lg:flex-row lg:items-center justify-between gap-4\">
                      <div className=\"space-y-2\">
                        <div className=\"flex items-center gap-2 flex-wrap\">
                          <Building2 className=\"h-4 w-4 text-primary\" />
                          <span className=\"font-medium\">{request.ngo_name}</span>
                          <Badge className={getUrgencyColor(request.urgency_level)}>
                            {request.urgency_level === 'critical' && <AlertTriangle className=\"h-3 w-3 mr-1\" />}
                            {request.urgency_level}
                          </Badge>
                        </div>
                        <div className=\"flex flex-wrap items-center gap-4 text-sm text-muted-foreground\">
                          <span className=\"flex items-center gap-1\">
                            <Package className=\"h-3 w-3\" />
                            {request.food_type} • {request.quantity} servings
                          </span>
                          <span className=\"flex items-center gap-1\">
                            <MapPin className=\"h-3 w-3\" />
                            {request.address}
                          </span>
                          {request.distance && (
                            <span className=\"flex items-center gap-1 text-primary font-medium\">
                              {request.distance.toFixed(1)} km away
                            </span>
                          )}
                        </div>
                        {request.description && (
                          <p className=\"text-sm text-muted-foreground\">{request.description}</p>
                        )}
                        <div className=\"text-xs text-muted-foreground\">
                          Needed: {request.quantity - request.fulfilled_quantity} more servings
                        </div>
                      </div>
                      <Button 
                        className=\"rounded-full\"
                        onClick={() => setSelectedRequest(request)}
                        data-testid={`fulfill-btn-${request.id}`}
                      >
                        <Heart className=\"h-4 w-4 mr-2\" />
                        Fulfill Request
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Fulfillments */}
        {fulfillments.length > 0 && (
          <Card className=\"border-stone-200\">
            <CardHeader>
              <CardTitle className=\"font-heading\">My Fulfillments</CardTitle>
              <CardDescription>Track your donation contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className=\"space-y-4\">
                {fulfillments.map((fulfillment) => (
                  <div 
                    key={fulfillment.id} 
                    className=\"p-4 rounded-xl border border-stone-200\"
                    data-testid={`fulfillment-${fulfillment.id}`}
                  >
                    <div className=\"flex items-center justify-between\">
                      <div>
                        <p className=\"font-medium\">{fulfillment.quantity} servings • {fulfillment.food_condition}</p>
                        <p className=\"text-sm text-muted-foreground\">
                          Delivery: {fulfillment.delivery_method}
                        </p>
                      </div>
                      <Badge className={
                        fulfillment.status === 'confirmed' ? 'bg-green-500 text-white' :
                        fulfillment.status === 'delivered' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
                      }>
                        {fulfillment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <FulfillRequestModal 
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
        onSuccess={() => {
          fetchData();
          setSelectedRequest(null);
        }}
        userLocation={userLocation}
      />
    </DashboardLayout>
  );
};

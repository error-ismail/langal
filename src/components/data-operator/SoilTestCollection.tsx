import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Beaker,
  TrendingUp,
  Droplets,
  ThermometerSun,
  Eye,
  Trash2,
  MapPin,
  Calendar,
  Plus,
  Star,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationSelector from '@/components/farmer/LocationSelector';
import DataOperatorHeader from '@/components/data-operator/DataOperatorHeader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LocationData {
  postal_code: number;
  division: string;
  division_bn: string;
  district: string;
  district_bn: string;
  upazila: string;
  upazila_bn: string;
  post_office: string;
  post_office_bn: string;
  village: string;
}

interface SoilTestReport {
  report_id: number;
  farmer_id?: number;
  farmer_name?: string;
  farmer_phone?: string;
  postal_code?: number;
  village: string;
  field_size?: number;
  current_crop?: string;
  test_date: string;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  ph_level?: number;
  ec_value?: number;
  soil_moisture?: number;
  soil_temperature?: number;
  organic_matter?: number;
  soil_type?: 'loamy' | 'sandy' | 'clay' | 'silty';
  calcium?: number;
  magnesium?: number;
  sulfur?: number;
  zinc?: number;
  iron?: number;
  health_rating?: 'poor' | 'fair' | 'good' | 'excellent';
  fertilizer_recommendation?: string;
  crop_recommendation?: string;
  notes?: string;
  location_info?: {
    division_bn?: string;
    district_bn?: string;
    upazila_bn?: string;
    post_office_bn?: string;
  };
}

const SoilTestCollection = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<SoilTestReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<SoilTestReport | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    farmer_name: '',
    farmer_phone: '',
    village: '',
    postal_code: 0,
    field_size: '',
    current_crop: '',
    test_date: new Date().toISOString().split('T')[0],
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph_level: '',
    ec_value: '',
    soil_moisture: '',
    soil_temperature: '',
    organic_matter: '',
    soil_type: '',
    calcium: '',
    magnesium: '',
    sulfur: '',
    zinc: '',
    iron: '',
    health_rating: '',
    notes: ''
  });

  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/data-operator/soil-tests');
      setReports(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error(error.response?.data?.message || 'রিপোর্ট লোড করতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };



  const handleLocationChange = (locationData: LocationData) => {
    setLocation(locationData);
    setFormData(prev => ({
      ...prev,
      postal_code: locationData.postal_code
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.village) {
      toast.error('গ্রামের নাম দিন');
      return;
    }

    try {
      setLoading(true);
      await api.post('/data-operator/soil-tests', {
        ...formData,
        farmer_name: formData.farmer_name || null,
        farmer_phone: formData.farmer_phone || null,
        postal_code: formData.postal_code || null,
        field_size: formData.field_size || null,
        nitrogen: formData.nitrogen || null,
        phosphorus: formData.phosphorus || null,
        potassium: formData.potassium || null,
        ph_level: formData.ph_level || null,
        ec_value: formData.ec_value || null,
        soil_moisture: formData.soil_moisture || null,
        soil_temperature: formData.soil_temperature || null,
        organic_matter: formData.organic_matter || null,
        soil_type: formData.soil_type || null,
        calcium: formData.calcium || null,
        magnesium: formData.magnesium || null,
        sulfur: formData.sulfur || null,
        zinc: formData.zinc || null,
        iron: formData.iron || null,
        health_rating: formData.health_rating || null
      });
      
      toast.success('মাটি পরীক্ষার রিপোর্ট সংরক্ষিত হয়েছে');
      
      // Reset form
      setFormData({
        farmer_name: '',
        farmer_phone: '',
        village: '',
        postal_code: 0,
        field_size: '',
        current_crop: '',
        test_date: new Date().toISOString().split('T')[0],
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        ph_level: '',
        ec_value: '',
        soil_moisture: '',
        soil_temperature: '',
        organic_matter: '',
        soil_type: '',
        calcium: '',
        magnesium: '',
        sulfur: '',
        zinc: '',
        iron: '',
        health_rating: '',
        notes: ''
      });
      setLocation(null);
      setShowForm(false);
      
      // Refresh list
      fetchReports();
    } catch (error: any) {
      console.error('Error saving report:', error);
      toast.error(error.response?.data?.message || 'রিপোর্ট সংরক্ষণ করতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId: number) => {
    if (!confirm('আপনি কি এই রিপোর্ট মুছে ফেলতে চান?')) return;

    try {
      await api.delete(`/data-operator/soil-tests/${reportId}`);
      toast.success('রিপোর্ট মুছে ফেলা হয়েছে');
      fetchReports();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'রিপোর্ট মুছতে ব্যর্থ');
    }
  };

  const getHealthBadge = (rating: string) => {
    const configs: any = {
      'excellent': { color: 'bg-green-100 text-green-800', icon: '⭐⭐⭐⭐' },
      'good': { color: 'bg-blue-100 text-blue-800', icon: '⭐⭐⭐' },
      'fair': { color: 'bg-yellow-100 text-yellow-800', icon: '⭐⭐' },
      'poor': { color: 'bg-red-100 text-red-800', icon: '⭐' }
    };
    return configs[rating] || configs['fair'];
  };

  const getSoilTypeBn = (type: string) => {
    const types: any = {
      'loamy': 'দোআঁশ',
      'sandy': 'বেলে',
      'clay': 'এঁটেল',
      'silty': 'পলি'
    };
    return types[type] || type;
  };

  const getHealthRatingBn = (rating: string) => {
    const ratings: any = {
      'excellent': 'চমৎকার',
      'good': 'ভালো',
      'fair': 'মাঝারি',
      'poor': 'খারাপ'
    };
    return ratings[rating] || rating;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DataOperatorHeader />
      
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 min-h-[calc(100vh-73px)] p-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/data-operator-dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">মাটি পরীক্ষা রিপোর্ট</h1>
                <p className="text-sm text-gray-600">সেন্সর দিয়ে মাটি পরীক্ষা ও বিশ্লেষণ</p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              নতুন পরীক্ষা
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Beaker className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">মোট পরীক্ষা</div>
                  <div className="text-2xl font-bold text-gray-800">{reports.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">আজকের পরীক্ষা</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {reports.filter(r => r.test_date === new Date().toISOString().split('T')[0]).length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">চমৎকার স্বাস্থ্য</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {reports.filter(r => r.health_rating === 'excellent').length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">এলাকা</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {new Set(reports.map(r => r.village)).size}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                নতুন মাটি পরীক্ষা রিপোর্ট
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Farmer Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    কৃষকের তথ্য
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farmer_name">কৃষকের নাম</Label>
                      <Input
                        id="farmer_name"
                        value={formData.farmer_name}
                        onChange={(e) => setFormData({ ...formData, farmer_name: e.target.value })}
                        placeholder="কৃষকের পূর্ণ নাম"
                      />
                    </div>
                    <div>
                      <Label htmlFor="farmer_phone">মোবাইল নম্বর</Label>
                      <Input
                        id="farmer_phone"
                        value={formData.farmer_phone}
                        onChange={(e) => setFormData({ ...formData, farmer_phone: e.target.value })}
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Selector */}
                <div className="space-y-4">
                  <Label>এলাকা নির্বাচন করুন</Label>
                  <LocationSelector
                    value={location}
                    onChange={handleLocationChange}
                  />
                </div>

                {/* Field Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="field_size">জমির আকার (শতক/বিঘা)</Label>
                    <Input
                      id="field_size"
                      type="number"
                      step="0.01"
                      value={formData.field_size}
                      onChange={(e) => setFormData({ ...formData, field_size: e.target.value })}
                      placeholder="যেমন: 2.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="current_crop">বর্তমান ফসল</Label>
                    <Input
                      id="current_crop"
                      value={formData.current_crop}
                      onChange={(e) => setFormData({ ...formData, current_crop: e.target.value })}
                      placeholder="যেমন: ধান, গম"
                    />
                  </div>
                </div>

                {/* Test Date */}
                <div>
                  <Label htmlFor="test_date">পরীক্ষার তারিখ *</Label>
                  <Input
                    id="test_date"
                    type="date"
                    value={formData.test_date}
                    onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
                    required
                  />
                </div>

                {/* NPK Values */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    NPK মান (mg/kg বা ppm)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="nitrogen">নাইট্রোজেন (N)</Label>
                      <Input
                        id="nitrogen"
                        type="number"
                        step="0.01"
                        value={formData.nitrogen}
                        onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                        placeholder="যেমন: 45.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phosphorus">ফসফরাস (P)</Label>
                      <Input
                        id="phosphorus"
                        type="number"
                        step="0.01"
                        value={formData.phosphorus}
                        onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                        placeholder="যেমন: 32.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="potassium">পটাশিয়াম (K)</Label>
                      <Input
                        id="potassium"
                        type="number"
                        step="0.01"
                        value={formData.potassium}
                        onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                        placeholder="যেমন: 28.0"
                      />
                    </div>
                  </div>
                </div>

                {/* pH and EC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ph_level">pH মান (0-14)</Label>
                    <Input
                      id="ph_level"
                      type="number"
                      step="0.01"
                      min="0"
                      max="14"
                      value={formData.ph_level}
                      onChange={(e) => setFormData({ ...formData, ph_level: e.target.value })}
                      placeholder="যেমন: 6.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ec_value">EC মান (dS/m) - লবণাক্ততা</Label>
                    <Input
                      id="ec_value"
                      type="number"
                      step="0.01"
                      value={formData.ec_value}
                      onChange={(e) => setFormData({ ...formData, ec_value: e.target.value })}
                      placeholder="যেমন: 1.2"
                    />
                  </div>
                </div>

                {/* Physical Properties */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Droplets className="h-5 w-5" />
                    ভৌত গুণাবলী
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="soil_moisture">মাটির আর্দ্রতা (%)</Label>
                      <Input
                        id="soil_moisture"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={formData.soil_moisture}
                        onChange={(e) => setFormData({ ...formData, soil_moisture: e.target.value })}
                        placeholder="যেমন: 25.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="soil_temperature">মাটির তাপমাত্রা (°C)</Label>
                      <Input
                        id="soil_temperature"
                        type="number"
                        step="0.01"
                        value={formData.soil_temperature}
                        onChange={(e) => setFormData({ ...formData, soil_temperature: e.target.value })}
                        placeholder="যেমন: 28.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organic_matter">জৈব পদার্থ (%)</Label>
                      <Input
                        id="organic_matter"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={formData.organic_matter}
                        onChange={(e) => setFormData({ ...formData, organic_matter: e.target.value })}
                        placeholder="যেমন: 3.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Soil Type */}
                <div>
                  <Label htmlFor="soil_type">মাটির ধরন</Label>
                  <Select
                    value={formData.soil_type}
                    onValueChange={(value) => setFormData({ ...formData, soil_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="মাটির ধরন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loamy">দোআঁশ</SelectItem>
                      <SelectItem value="sandy">বেলে</SelectItem>
                      <SelectItem value="clay">এঁটেল</SelectItem>
                      <SelectItem value="silty">পলি</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Micronutrients */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">অন্যান্য উপাদান (mg/kg) - ঐচ্ছিক</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor="calcium">ক্যালসিয়াম (Ca)</Label>
                      <Input
                        id="calcium"
                        type="number"
                        step="0.01"
                        value={formData.calcium}
                        onChange={(e) => setFormData({ ...formData, calcium: e.target.value })}
                        placeholder="Ca"
                      />
                    </div>
                    <div>
                      <Label htmlFor="magnesium">ম্যাগনেসিয়াম (Mg)</Label>
                      <Input
                        id="magnesium"
                        type="number"
                        step="0.01"
                        value={formData.magnesium}
                        onChange={(e) => setFormData({ ...formData, magnesium: e.target.value })}
                        placeholder="Mg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sulfur">সালফার (S)</Label>
                      <Input
                        id="sulfur"
                        type="number"
                        step="0.01"
                        value={formData.sulfur}
                        onChange={(e) => setFormData({ ...formData, sulfur: e.target.value })}
                        placeholder="S"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zinc">জিংক (Zn)</Label>
                      <Input
                        id="zinc"
                        type="number"
                        step="0.01"
                        value={formData.zinc}
                        onChange={(e) => setFormData({ ...formData, zinc: e.target.value })}
                        placeholder="Zn"
                      />
                    </div>
                    <div>
                      <Label htmlFor="iron">আয়রন (Fe)</Label>
                      <Input
                        id="iron"
                        type="number"
                        step="0.01"
                        value={formData.iron}
                        onChange={(e) => setFormData({ ...formData, iron: e.target.value })}
                        placeholder="Fe"
                      />
                    </div>
                  </div>
                </div>

                {/* Health Rating */}
                <div>
                  <Label htmlFor="health_rating">মাটির স্বাস্থ্য রেটিং</Label>
                  <Select
                    value={formData.health_rating}
                    onValueChange={(value) => setFormData({ ...formData, health_rating: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="স্বাস্থ্য রেটিং নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">⭐⭐⭐⭐ চমৎকার</SelectItem>
                      <SelectItem value="good">⭐⭐⭐ ভালো</SelectItem>
                      <SelectItem value="fair">⭐⭐ মাঝারি</SelectItem>
                      <SelectItem value="poor">⭐ খারাপ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">অতিরিক্ত মন্তব্য</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="অন্যান্য গুরুত্বপূর্ণ তথ্য"
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                    {loading ? 'সংরক্ষণ হচ্ছে...' : 'রিপোর্ট সংরক্ষণ করুন'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    বাতিল
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>সংরক্ষিত পরীক্ষা রিপোর্ট</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && reports.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Beaker className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p>কোন পরীক্ষা রিপোর্ট পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report) => (
                  <Card key={report.report_id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{report.village}</h3>
                            <p className="text-sm text-gray-600">
                              {report.location_info?.upazila_bn}, {report.location_info?.district_bn}
                            </p>
                            {report.farmer_name && (
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <User className="h-3 w-3" />
                                {report.farmer_name} {report.farmer_phone && `- ${report.farmer_phone}`}
                              </p>
                            )}
                          </div>
                          {report.health_rating && (
                            <Badge className={getHealthBadge(report.health_rating).color}>
                              {getHealthBadge(report.health_rating).icon}
                            </Badge>
                          )}
                        </div>

                        {(report.nitrogen || report.phosphorus || report.potassium) && (
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <div className="font-medium mb-1">NPK মান:</div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              {report.nitrogen && <div>N: {report.nitrogen}</div>}
                              {report.phosphorus && <div>P: {report.phosphorus}</div>}
                              {report.potassium && <div>K: {report.potassium}</div>}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {report.ph_level && (
                            <div>pH: {report.ph_level}</div>
                          )}
                          {report.soil_type && (
                            <div>{getSoilTypeBn(report.soil_type)}</div>
                          )}
                        </div>

                        <div className="text-sm text-gray-600">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          {new Date(report.test_date).toLocaleDateString('bn-BD')}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedReport(report);
                              setIsViewOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            বিস্তারিত
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(report.report_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* View Details Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>মাটি পরীক্ষা রিপোর্টের বিস্তারিত</DialogTitle>
            <DialogDescription>
              সেন্সর দিয়ে সংগৃহীত মাটি বিশ্লেষণ তথ্য
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{selectedReport.village}</h3>
                <p className="text-sm text-gray-600">
                  {selectedReport.location_info?.division_bn} › {selectedReport.location_info?.district_bn} › {selectedReport.location_info?.upazila_bn}
                </p>
                {selectedReport.farmer_name && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-sm text-gray-500">কৃষকের তথ্য</p>
                    <p className="font-medium flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-green-600" />
                      {selectedReport.farmer_name}
                      {selectedReport.farmer_phone && ` - ${selectedReport.farmer_phone}`}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">তারিখ</Label>
                  <p className="font-medium">{new Date(selectedReport.test_date).toLocaleDateString('bn-BD')}</p>
                </div>
                {selectedReport.field_size && (
                  <div>
                    <Label className="text-sm text-gray-500">জমির আকার</Label>
                    <p className="font-medium">{selectedReport.field_size} শতক</p>
                  </div>
                )}
                {selectedReport.current_crop && (
                  <div>
                    <Label className="text-sm text-gray-500">বর্তমান ফসল</Label>
                    <p className="font-medium">{selectedReport.current_crop}</p>
                  </div>
                )}
                {selectedReport.soil_type && (
                  <div>
                    <Label className="text-sm text-gray-500">মাটির ধরন</Label>
                    <p className="font-medium">{getSoilTypeBn(selectedReport.soil_type)}</p>
                  </div>
                )}
                {selectedReport.health_rating && (
                  <div>
                    <Label className="text-sm text-gray-500">স্বাস্থ্য রেটিং</Label>
                    <p className="font-medium">{getHealthBadge(selectedReport.health_rating).icon} {getHealthRatingBn(selectedReport.health_rating)}</p>
                  </div>
                )}
              </div>

              {/* NPK Values */}
              {(selectedReport.nitrogen || selectedReport.phosphorus || selectedReport.potassium) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">NPK মান (mg/kg)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedReport.nitrogen && (
                      <div>
                        <Label className="text-sm text-gray-500">নাইট্রোজেন (N)</Label>
                        <p className="font-medium text-lg">{selectedReport.nitrogen}</p>
                      </div>
                    )}
                    {selectedReport.phosphorus && (
                      <div>
                        <Label className="text-sm text-gray-500">ফসফরাস (P)</Label>
                        <p className="font-medium text-lg">{selectedReport.phosphorus}</p>
                      </div>
                    )}
                    {selectedReport.potassium && (
                      <div>
                        <Label className="text-sm text-gray-500">পটাশিয়াম (K)</Label>
                        <p className="font-medium text-lg">{selectedReport.potassium}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Physical Properties */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedReport.ph_level && (
                  <div>
                    <Label className="text-sm text-gray-500">pH মান</Label>
                    <p className="font-medium">{selectedReport.ph_level}</p>
                  </div>
                )}
                {selectedReport.ec_value && (
                  <div>
                    <Label className="text-sm text-gray-500">EC (dS/m)</Label>
                    <p className="font-medium">{selectedReport.ec_value}</p>
                  </div>
                )}
                {selectedReport.soil_moisture && (
                  <div>
                    <Label className="text-sm text-gray-500">আর্দ্রতা</Label>
                    <p className="font-medium">{selectedReport.soil_moisture}%</p>
                  </div>
                )}
                {selectedReport.soil_temperature && (
                  <div>
                    <Label className="text-sm text-gray-500">তাপমাত্রা</Label>
                    <p className="font-medium">{selectedReport.soil_temperature}°C</p>
                  </div>
                )}
                {selectedReport.organic_matter && (
                  <div>
                    <Label className="text-sm text-gray-500">জৈব পদার্থ</Label>
                    <p className="font-medium">{selectedReport.organic_matter}%</p>
                  </div>
                )}
              </div>

              {/* Micronutrients */}
              {(selectedReport.calcium || selectedReport.magnesium || selectedReport.sulfur || selectedReport.zinc || selectedReport.iron) && (
                <div>
                  <h4 className="font-semibold mb-3">অন্যান্য উপাদান (mg/kg)</h4>
                  <div className="grid grid-cols-5 gap-4">
                    {selectedReport.calcium && <div className="text-center"><Label className="text-xs">Ca</Label><p className="font-medium">{selectedReport.calcium}</p></div>}
                    {selectedReport.magnesium && <div className="text-center"><Label className="text-xs">Mg</Label><p className="font-medium">{selectedReport.magnesium}</p></div>}
                    {selectedReport.sulfur && <div className="text-center"><Label className="text-xs">S</Label><p className="font-medium">{selectedReport.sulfur}</p></div>}
                    {selectedReport.zinc && <div className="text-center"><Label className="text-xs">Zn</Label><p className="font-medium">{selectedReport.zinc}</p></div>}
                    {selectedReport.iron && <div className="text-center"><Label className="text-xs">Fe</Label><p className="font-medium">{selectedReport.iron}</p></div>}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedReport.notes && (
                <div>
                  <Label className="text-sm text-gray-500">অতিরিক্ত মন্তব্য</Label>
                  <p className="mt-1 text-sm bg-gray-50 p-3 rounded">{selectedReport.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default SoilTestCollection;

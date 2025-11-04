import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, MapPin, Users, Award, Star, ExternalLink, Filter, Grid, List, Phone, Mail, Calendar, Building, GraduationCap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { College, collegesData } from '../data/collegesData';

export function Colleges() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [colleges, setColleges] = useState<College[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'students'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setColleges(collegesData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const locations = [...new Set(collegesData.map(college => college.address.split(',').pop()?.trim()))];

  const filteredColleges = colleges
    .filter(college => {
      const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          college.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !selectedLocation || college.address.includes(selectedLocation);
      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'students':
          return parseInt(b.students || '0') - parseInt(a.students || '0');
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleCollegeClick = (website: string) => {
    window.open(website, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="relative w-20 h-20 mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Colleges</h3>
            <p className="text-gray-500">Discovering educational institutions...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.section 
        className="relative py-16 sm:py-20 lg:py-24 px-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"></div>
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 80%, rgba(79, 70, 229, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="relative max-w-6xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GraduationCap className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              BCSIT Colleges in Nepal
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 mb-8 px-4 sm:px-0">
              Discover top educational institutions offering BCSIT programs across Nepal
            </p>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { icon: Building, label: 'Total Colleges', value: colleges.length },
              { icon: Users, label: 'Students', value: '4,000+' },
              { icon: MapPin, label: 'Cities', value: locations.length },
              { icon: Award, label: 'Programs', value: '50+' }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-yellow-300" />
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Controls Section */}
        <motion.section 
          className="py-6 sm:py-8 px-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search colleges by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="students">Students</option>
              </select>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Locations</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {selectedLocation && (
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedLocation('')}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Colleges Grid/List */}
        {filteredColleges.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
          >
            <AnimatePresence>
              {filteredColleges.map((college, index) => (
                <motion.div
                  key={college.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => handleCollegeClick(college.website)}
                  className="cursor-pointer group"
                >
                  <Card className="h-full bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* College Logo & Header */}
                    <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-16 h-16 rounded-full bg-white p-2 flex items-center justify-center shadow-sm border border-gray-200">
                          <img
                            src={college.logo}
                            alt={college.name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64';
                            }}
                          />
                        </div>
                        {college.rating && (
                          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="font-medium">{college.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {college.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{college.address}</span>
                      </div>
                    </div>

                    {/* College Details */}
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-3 mb-4">
                        {college.established && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            <span>Established {college.established}</span>
                          </div>
                        )}
                        
                        {college.students && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-green-500" />
                            <span>{college.students} Students</span>
                          </div>
                        )}

                        {college.programs && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {college.programs.slice(0, 2).map((program, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {program}
                              </span>
                            ))}
                            {college.programs.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{college.programs.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Contact Info */}
                      {college.contact && (
                        <div className="space-y-2 mb-4 text-sm">
                          {college.contact.phone && (
                            <div className="flex items-center text-gray-600">
                              <Phone className="w-3 h-3 mr-2" />
                              <span>{college.contact.phone}</span>
                            </div>
                          )}
                          {college.contact.email && (
                            <div className="flex items-center text-gray-600">
                              <Mail className="w-3 h-3 mr-2" />
                              <span className="truncate">{college.contact.email}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Visit Website Button */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 font-medium">
                          <Globe className="w-4 h-4 mr-2" />
                          <span>Visit Website</span>
                          <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedLocation 
                ? "Try adjusting your search or filter criteria" 
                : "No colleges available at the moment"}
            </p>
            {(searchTerm || selectedLocation) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLocation('');
                }}
              >
                Clear Search & Filters
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}


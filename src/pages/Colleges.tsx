import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

interface College {
  id: string;
  name: string;
  address: string;
  website: string;
  logo: string;
}

export function Colleges() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [colleges, setColleges] = useState<College[]>([]);

  useEffect(() => {
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      setColleges(mockColleges);
      setLoading(false);
    }, 1500); // 1.5 second delay to show loading state

    return () => clearTimeout(timer);
  }, []);

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCollegeClick = (website: string) => {
    window.open(website, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600">Loading Colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            BCSIT Colleges in Nepal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Click on any college to visit their official website
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-md mx-auto relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search colleges by name or address..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>

        {/* Colleges Grid */}
        {filteredColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredColleges.map((college, index) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCollegeClick(college.website)}
                className="cursor-pointer"
              >
                <Card className="h-full transition-all hover:shadow-lg">
                  <div className="p-6 flex flex-col items-center">
                    <div className="w-32 h-32 mb-4 rounded-full bg-white p-4 flex items-center justify-center shadow-sm border border-gray-200">
                      <img
                        src={college.logo}
                        alt={college.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </div>
                    <CardHeader className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {college.name}
                      </h3>
                      <div className="flex items-center justify-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{college.address}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex justify-center mt-2">
                      <div className="flex items-center space-x-2 text-indigo-600">
                        <Globe className="w-5 h-5" />
                        <span>Visit Website</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-xl font-medium text-gray-700">
              {searchTerm ? `No colleges found matching "${searchTerm}"` : "No colleges available"}
            </h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? "Try searching with different keywords" : "Please check back later"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Mock data (same as your original)
const mockColleges = [
  {
    id: '1',
    name: 'Ace Institute of Management',
    address: 'New Baneshwor, Kathmandu',
    website: 'https://ace.edu.np',
    logo: '/logos/ace.jpg',
  },
  {
    id: '2',
    name: 'SAIM College',
    address: 'Old Baneswor, Kathmandu',
    website: 'https://saim.edu.np',
    logo: '/logos/saim.jpg',
  },
  {
    id: '3',
    name: 'Apollo International College',
    address: 'Baneshwor, Kathmandu',
    website: 'https://www.apollointcollege.edu.np',
    logo: '/logos/apollo.jpg',
  },
  {
    id: '4',
    name: 'Quest International College',
    address: 'Gwarko, Lalitpur',
    website: 'https://quest.edu.np',
    logo: '/logos/quest.png',
  },
  {
    id: '5',
    name: 'Shubhashree College of Management',
    address: 'New Baneshwor, Kathmandu',
    website: 'https://shubhashreecollege.edu.np',
    logo: '/logos/shubhashree.jpg',
  },
  {
    id: '6',
    name: 'Liberty College',
    address: 'Anamnagar, Kathmandu',
    website: 'https://libertycollege.edu.np',
    logo: '/logos/liberty.png',
  },
  {
    id: '7',
    name: 'Uniglobe College',
    address: 'New Baneshwor, Kathmandu',
    website: 'https://uniglobe.edu.np',
    logo: '/logos/uniglobe.jpg',
  },
  {
    id: '8',
    name: 'Excel Business College',
    address: 'New Baneshwor, Kathmandu',
    website: 'https://excel.edu.np',
    logo: '/logos/excel.jpg',
  },
  {
    id: '9',
    name: 'Malpi International College',
    address: 'Basundhara, Kathmandu',
    website: 'https://mic.edu.np',
    logo: 'logos/malpi.png',
  },
  {
    id: '10',
    name: 'Nobel College',
    address: 'Sinamangal, Kathmandu',
    website: 'https://nobel.edu.np',
    logo: '/logos/nobel.jpg',
  },
  {
    id: '11',
    name: 'Boston International College',
    address: 'Bharatpur, Chitwan',
    website: 'https://bostoncollege.edu.np',
    logo: '/logos/boston.jpg',
  },
  {
    id: '12',
    name: 'Pokhara College of Management',
    address: 'Pokhara, Kaski',
    website: 'https://pcm.edu.np',
    logo: '/logos/pokhara.jpg',
  },
  {
    id: '13',
    name: 'Apex College',
    address: 'Mid Baneshwor, Kathmandu',
    website: 'https://apexcollege.edu.np',
    logo: '/logos/apex.jpg',
  },
  {
    id: '14',
    name: 'Medhavi College',
    address: 'Shankhamul, Kathmandu',
    website: 'https://medhavicollege.edu.np',
    logo: '/logos/medhabi.jpg',
  },
  {
    id: '15',
    name: 'Crimson College of Technology',
    address: 'Butwal, Rupandehi',
    website: 'https://cct.edu.np',
    logo: '/logos/crimson.jpg',
  },
  {
    id: '16',
    name: 'Rajdhani Model College',
    address: 'Old Baneshwor, Kathmandu',
    website: 'https://rmccollege.edu.np',
    logo: '/logos/rajdhani.jpg',
  },
];

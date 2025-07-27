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
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/313409731_436587858676107_3177398216819216975_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=CCt_Un-yMLoQ7kNvwGqGNoA&_nc_oc=AdneDZaOpz06zU4Wk8DUSuQhA7invRcspuFUUo31bg_C_VuQYLMNxEjQo5eJwJiBCt9iS6dCRw1QN_z-_zATOb8f&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=8CehY5G83mmLHg_YdGMMug&oh=00_AfR2n8elCJDTHQW7ZCgiRuvr3J7aCztRv75wwJj81zykgw&oe=6886709D',
  },
  {
    id: '2',
    name: 'SAIM College',
    address: 'Old Baneswor, Kathmandu',
    website: 'https://saim.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/414753160_747279430768804_5161724744221104351_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Y7C4-PlBRsIQ7kNvwERagjJ&_nc_oc=AdkKRaTRmxDM2ciFTHvtk9u2kOhfZ1AhuoYTOgVQ2Rkqbd5UvPh9zdig27Dqzoqca8d6XZooaOTpf1ZGRXqJSi61&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=gYkRVRI5jtbIPlNwFt-S_Q&oh=00_AfQl5yO9PpUyn6hlNQRyitpeoon4Sjr9XtIi_rTfiOkjuA&oe=68866ACC',
  },
  {
    id: '3',
    name: 'Apollo International College',
    address: 'Baneshwor, Kathmandu',
    website: 'https://www.apollointcollege.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/506799502_1306723401462293_2908970770400528980_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=vitdwYt9_hMQ7kNvwHyyaZL&_nc_oc=AdkXeD2LpsTaFcRxey2kx7zLQq7JebBFKc5C1Ky_KHh_41Pn90sOrkFlUhTYMpFZ4nmsGPlCiomMn9Veu4oxiMwv&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=CFm4W4YG8HiLkjUvnzKH-Q&oh=00_AfSokXycS0Y1dOZk4GzJj6R6Um1QxxBw2frd2wzAzSlBIg&oe=68864DF1',
  },
  {
    id: '4',
    name: 'Quest International College',
    address: 'Gwarko, Lalitpur',
    website: 'https://quest.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/306797661_466919755478196_9085837511235824946_n.png?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ODeFjOzbrkEQ7kNvwEzO1Bz&_nc_oc=AdkVhuTJIrgiX6NuHe-N4Vmz2tqmeosr-HvEMTJb9pWcyGmmsHYd_F_536gEx4hU0kI7P3Umjn1lbTdgc5Hvj2_M&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=ml6A2Ik8QVWBTP1PH9Cp0A&oh=00_AfQvO1kCyfKbcHLcpT0Gnybggxwc_HCm9iZcIeq8BcG-Cg&oe=68864E59',
  },
  {
    id: '5',
    name: 'Shubhashree College of Management',
    address: 'New Baneshwor, Kathmandu',
    website: 'https://shubhashreecollege.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/307197408_103240822550343_3759305468378685181_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=FhDsemnkCfIQ7kNvwGdzH-2&_nc_oc=AdnSsxV1pqJaNvITSlmnLtTRCt_-x91tGKVDuv1lneQknXvRByvXbrYxbua0Y7N-l4SorTv3RJnd3YLX6NswEXKO&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=fBB_fKCgbdEI_hK9P8q35Q&oh=00_AfR6O9Z_mTIpTqUfc6rwUXBdZz-TEkFogKq1lAVx2vOCiw&oe=6886542A',
  },
  {
    id: '6',
    name: 'Liberty College',
    address: 'Anamnagar, Kathmandu',
    website: 'https://libertycollege.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/307551754_457271183110673_2916391225340937495_n.png?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=YA6iSNz_tgwQ7kNvwFRtFBS&_nc_oc=AdnzI6R48JMZ94NCAeGMseYCKN7QvbaWGwvmg6FRLtETCe3QVA11lxLdl7tbZ4-WK6hANB2MMtaHkpCWR7v8yU38&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=qrztrOYleZXYPppVdcX5iw&oh=00_AfRMnz3rjQD7_Z3xKZpuAfegIST3nHIOHKbag1c6urbJMg&oe=68863DC8',
  },
  {
    id: '7',
    name: 'Uniglobe College',
    address: 'New Baneshwor, Kathmandu',
    website: 'https://uniglobe.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/304907992_2640081469466683_1235096484845385307_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Wzyz8zqptDsQ7kNvwHsO9lG&_nc_oc=AdkaaN8W13XKd8cOfeiF6kpKV9VSbrqfv8dJN6AytRL4_VhEkv3dASxA7iKk1G3j3EMhzxSN6iL5hnZPn4-6od80&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=Ybk7ah0jSaaWbsCmZosCvg&oh=00_AfQkEuHZ3R_kB2py7OEKm3fX0D2IrSlZ96yrbZemD-hqnw&oe=6886448D',
  },
  {
    id: '8',
    name: 'Excel Business College',
    address: 'New Baneshwor, Kathmandu',
    website: 'https://excel.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/464155855_961792489325363_4716511949698786085_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=nB2qiga9jUoQ7kNvwGX5IqZ&_nc_oc=AdmVCiKkvFjr_MTnD-QCWMSwlo47htNhG6rTpnqJsAjAgk2APq0ds5PrYkiVCRse_O8kdI5U5jsPnzNvUHTbZApX&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=dhGDIvRCaWRWzax6TIHEUA&oh=00_AfSnaAD-LHU5KEfKiOy1U51K2LZpLFDUVghzSB3mlnP5HA&oe=688647C5',
  },
  {
    id: '9',
    name: 'Malpi International College',
    address: 'Basundhara, Kathmandu',
    website: 'https://mic.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-1/306930416_612871717297116_1305884352381086955_n.png?stp=dst-png_s200x200&_nc_cat=101&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=k01CwLZbfOgQ7kNvwFd7biC&_nc_oc=Adn3dIJK-Yub37eCNTZpS8KRQdr47tFTZPU40tOH1vH_cUjyAiCiIMWqhXjKNiKC5UKJY2vQn2smjYnLejrILZyU&_nc_zt=24&_nc_ht=scontent.fktm17-1.fna&_nc_gid=91wVUiDbhm2fOOovkOwQxQ&oh=00_AfQnhWSqYIFhy5vLcW0vFip6O0vjEGJZy2raxeZ2GuRTNA&oe=688671FD',
  },
  {
    id: '10',
    name: 'Nobel College',
    address: 'Sinamangal, Kathmandu',
    website: 'https://nobel.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/447035757_468349025847431_1554368224847496656_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=O3fmdNbaxq4Q7kNvwEvSdh9&_nc_oc=AdljAx-9e8LLrTTyakYe_I57mM77D1at6BTHq9lT3axRmGGL0CIWX2U1l9eBRnlzhReTi3Ccghug1C7H3Cm9gxqr&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=bz-a5hXLbU05C425bfEGjQ&oh=00_AfTqG27yPRPhfnQM9UDNFIDNZtCaIvBA1Y7cu3PbvXsk4g&oe=68864E3A',
  },
  {
    id: '11',
    name: 'Boston International College',
    address: 'Bharatpur, Chitwan',
    website: 'https://bostoncollege.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/306135183_376993687979277_1493759332082654439_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=TVI6ZuFFzXQQ7kNvwFclMG8&_nc_oc=Adk_k1F5B1MpBXvAXimckPN9yT89IJBrkxJlKqJXCTglfnpuVfwk1ai6V5X8ye2IGHSynmBQXjBXA0dA0G2NBdod&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=11Pubvy0FkpUn-HU6JbhoA&oh=00_AfS44ub1ASZDphTSeCatTU74rKGZwzICyOQt2NoM492p7w&oe=688672A4',
  },
  {
    id: '12',
    name: 'Pokhara College of Management',
    address: 'Pokhara, Kaski',
    website: 'https://pcm.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/486574539_2215477455552731_6738755419840711487_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=3n4K4_YO-YkQ7kNvwF88GDD&_nc_oc=AdnRCIeoEYH8re1dGhe4fxQyVoVYCXeqw45TPJ72Yn4mw2TEfrRPKLY0hSrO7hdhkuz39DcG6jZhYLyzmPRMXkuE&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=a285G4gBk3xZG3wNrtWsMg&oh=00_AfSvkkgAPswN2GtypzLMxebVne0G_f3ILVOtPgounbSKfA&oe=68880E1F',
  },
  {
    id: '13',
    name: 'Apex College',
    address: 'Mid Baneshwor, Kathmandu',
    website: 'https://apexcollege.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/393740430_733333565504706_6811930579939849732_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=PwVCAqLGR-cQ7kNvwEWfhNx&_nc_oc=AdkqEMxVZl3YIzGs3HMLkPtru2KAaoe9uumh6IyFAQ0RTkNUPqFLIuy_2ukTgmGWpX1OyNJrex2sIuTWOw_TGizb&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=5nKD0xm9XQTXGj6M2DS6Mg&oh=00_AfShfU5vpcvPE4A9z66FC8BKVyJ1HvlB9jbsaMUtYzKGug&oe=68866484',
  },
  {
    id: '14',
    name: 'Medhavi College',
    address: 'Shankhamul, Kathmandu',
    website: 'https://medhavicollege.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/452055891_882517903911443_4685100523744542681_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ZxrsFfSJ_C0Q7kNvwFvokRV&_nc_oc=AdlFbRZDXq8E6cNm2b6KS3kjuL_pb0scCAnnyvTYK55uE53SMxMvboPNhZZYNiG5Osik4-DS8wiN5MQO0lPKXf8o&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=nGqp_0Z63cCtUKLLeoUNkw&oh=00_AfQ5kimoU9EZeozKDGGrh8Eh9zwUAWwRMcZidV3eJBiDYg&oe=688645C4',
  },
  {
    id: '15',
    name: 'Crimson College of Technology',
    address: 'Butwal, Rupandehi',
    website: 'https://cct.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/298289070_405641238369902_8098165964461271345_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=xbcbtV7kSuQQ7kNvwF8VsTM&_nc_oc=Adl-EeSqkOZDsLrINCJpNtIbiayBVdn4aku87m0SDwavyXMTzYe2suc9gVKbikgu1IwQDKP0NMuOueMvMGY92kns&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=r2UkStlQ8QH1RZS1O9UxIQ&oh=00_AfQABLdWzHEhQPSDxsMUg_7ZsE0IXXwtQwJfObI8-K5seg&oe=688640F0',
  },
  {
    id: '16',
    name: 'Rajdhani Model College',
    address: 'Old Baneshwor, Kathmandu',
    website: 'https://rmccollege.edu.np',
    logo: 'https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/448887162_904823958332344_4618531361938005053_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=YOQWPZqJ_fUQ7kNvwHoroLj&_nc_oc=Adktt4jLP7dMLq9rUlAzzeGTLODb7IwMi4J35xi8O958Z1TE9k_wljs3tR7C-eo8HjuJ6HGVw0wrHv1-8gwMnmXW&_nc_zt=23&_nc_ht=scontent.fktm17-1.fna&_nc_gid=MliaN80M351tdAwblY8LTg&oh=00_AfR_fXM8pIdkVKDA_9aF_P086e7Ivw6lIWNTUN4JpVq8hA&oe=68883F2A',
  },
];

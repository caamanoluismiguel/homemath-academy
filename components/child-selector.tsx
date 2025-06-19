
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, User, Calendar, BookOpen, Globe } from 'lucide-react';
import { GRADE_LEVELS } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function ChildSelector() {
  const { children, selectedChild, selectChild, addChild, isLoading } = useAuth();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    preferredGrade: '',
    preferredLang: 'en' as 'en' | 'es',
  });

  const handleAddChild = async () => {
    if (!formData.name || !formData.preferredGrade) {
      toast({
        title: "Missing Information",
        description: "Please enter the child's name and preferred grade.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addChild(formData);
      setFormData({ name: '', birthDate: '', preferredGrade: '', preferredLang: 'en' });
      setShowAddForm(false);
      toast({
        title: "Child Added Successfully",
        description: `${formData.name} has been added to your account.`,
      });
    } catch (error) {
      toast({
        title: "Error Adding Child",
        description: "There was an error adding the child. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Select Child</span>
          </CardTitle>
          <CardDescription>
            Choose which child you'd like to work with, or add a new child to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Children */}
          {children && children.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Your Children</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {children.map((child) => (
                  <motion.div
                    key={child.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedChild?.id === child.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => selectChild(child.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                              {child.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">{child.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                <BookOpen className="w-3 h-3 mr-1" />
                                {child.preferredGrade} Grade
                              </Badge>
                              {child.preferredLang === 'es' && (
                                <Badge variant="outline" className="text-xs">
                                  <Globe className="w-3 h-3 mr-1" />
                                  ES
                                </Badge>
                              )}
                            </div>
                            {child.birthDate && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Age {calculateAge(child.birthDate)}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Child */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-gray-700">Add New Child</h4>
              {!showAddForm && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Child
                </Button>
              )}
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="childName">Child's Name *</Label>
                          <Input
                            id="childName"
                            placeholder="Enter child's name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="birthDate">Birth Date (Optional)</Label>
                          <Input
                            id="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="preferredGrade">Preferred Grade *</Label>
                          <Select 
                            value={formData.preferredGrade} 
                            onValueChange={(value) => setFormData({ ...formData, preferredGrade: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade level" />
                            </SelectTrigger>
                            <SelectContent>
                              {GRADE_LEVELS.map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  {grade} Grade
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="preferredLang">Preferred Language</Label>
                          <Select 
                            value={formData.preferredLang} 
                            onValueChange={(value: 'en' | 'es') => setFormData({ ...formData, preferredLang: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <Button 
                          onClick={handleAddChild}
                          disabled={isLoading || !formData.name || !formData.preferredGrade}
                          className="flex-1"
                        >
                          {isLoading ? 'Adding...' : 'Add Child'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowAddForm(false);
                            setFormData({ name: '', birthDate: '', preferredGrade: '', preferredLang: 'en' });
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {children && children.length === 0 && !showAddForm && (
              <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                <CardContent className="p-8 text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-700 mb-2">No Children Added Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Add your first child to get started with personalized math learning.
                  </p>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Child
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

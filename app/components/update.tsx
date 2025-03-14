import { PersonalityTemplate } from '@/app/utils/db';
import React, { useState, useEffect } from 'react';

interface UpdateOverlayProps {
  template: PersonalityTemplate;
  onClose: () => void;
  onSubmit: (updatedTemplate: PersonalityTemplate) => void;
}

const UpdateOverlay: React.FC<UpdateOverlayProps> = ({ template, onClose, onSubmit }) => {
  const [updatedTemplate, setUpdatedTemplate] = useState<PersonalityTemplate>(template);
  const [activeSection, setActiveSection] = useState<string>('personalInfo');

  // Deep clone the template to avoid direct mutations
  useEffect(() => {
    const clonedTemplate = JSON.parse(JSON.stringify(template));
    
    // Ensure languages is always an array
    if (!Array.isArray(clonedTemplate.languages)) {
      clonedTemplate.languages = [];
    }
    
    setUpdatedTemplate(clonedTemplate);
  }, [template]);

  const handleSubmit = () => {
    onSubmit(updatedTemplate);
    onClose();
  };

  const updatePersonalInfo = (field: string, value: string) => {
    const paths = field.split('.');
    setUpdatedTemplate(prev => {
      const newTemplate = { ...prev };
      let current: any = newTemplate.personalInfo;
      
      for (let i = 0; i < paths.length - 1; i++) {
        current = current[paths[i]];
      }
      
      current[paths[paths.length - 1]] = value;
      return newTemplate;
    });
  };

  const updateTraits = (field: string, value: any) => {
    const paths = field.split('.');
    setUpdatedTemplate(prev => {
      const newTemplate = { ...prev };
      let current: any = newTemplate.traits;
      
      for (let i = 0; i < paths.length - 1; i++) {
        current = current[paths[i]];
      }
      
      current[paths[paths.length - 1]] = value;
      return newTemplate;
    });
  };

  const updateFavorites = (field: string, value: any) => {
    const paths = field.split('.');
    setUpdatedTemplate(prev => {
      const newTemplate = { ...prev };
      let current: any = newTemplate.favorites;
      
      for (let i = 0; i < paths.length - 1; i++) {
        current = current[paths[i]];
      }
      
      current[paths[paths.length - 1]] = value;
      return newTemplate;
    });
  };

  const updateLanguages = (index: number, field: string, value: string) => {
    setUpdatedTemplate(prev => {
      const newTemplate = { ...prev };
      newTemplate.languages.language[index] = {
        ...newTemplate.languages.language[index],
        [field]: value
      };
      return newTemplate;
    });
  };

  const addLanguage = () => {
    setUpdatedTemplate(prev => {
      const newTemplate = { ...prev };
      newTemplate.languages.language.push({ name: null, proficiency: null });
      return newTemplate;
    });
  };

  const removeLanguage = (index: number) => {
    setUpdatedTemplate(prev => {
      const newTemplate = { ...prev };
      newTemplate.languages.language.splice(index, 1);
      return newTemplate;
    });
  };

  const updateMemories = (field: string, index: number, value: string) => {
    setUpdatedTemplate(prev => {
      const newTemplate = { ...prev };
      newTemplate.memories[field as keyof typeof newTemplate.memories][index] = value;
      return newTemplate;
    });
  };

  const addMemory = (field: string) => {
    setUpdatedTemplate(prev => {
      const newTemplate = { ...prev };
      (newTemplate.memories[field as keyof typeof newTemplate.memories] as Array<string | null>).push(null);
      return newTemplate;
    });
  };

  const removeMemory = (field: string, index: number) => {
    setUpdatedTemplate(prev => {
      const newTemplate = { ...prev };
      (newTemplate.memories[field as keyof typeof newTemplate.memories] as Array<string | null>).splice(index, 1);
      return newTemplate;
    });
  };

  const updateRelationship = (type: 'family' | 'friends', index: number, field: string, value: string) => {
    setUpdatedTemplate(prev => {
      const newTemplate = { ...prev };
      newTemplate.relationships[type][index] = {
        ...newTemplate.relationships[type][index],
        [field]: value
      };
      return newTemplate;
    });
  };

  const addRelationship = (type: 'family' | 'friends') => {
    setUpdatedTemplate(prev => {
      const newTemplate = { ...prev };
      if (type === 'family') {
        newTemplate.relationships.family.push({ name: null, relation: null, details: null });
      } else {
        newTemplate.relationships.friends.push({ name: null, details: null });
      }
      return newTemplate;
    });
  };

  const removeRelationship = (type: 'family' | 'friends', index: number) => {
    setUpdatedTemplate(prev => {
      const newTemplate = { ...prev };
      newTemplate.relationships[type].splice(index, 1);
      return newTemplate;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto text-gray-800">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Update Personality Template</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex mb-6">
            <div className="w-1/4 pr-4 text-white">
              <ul className="space-y-2">
                <li 
                  className={`cursor-pointer p-2 rounded-lg transition-colors ${activeSection === 'personalInfo' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  onClick={() => setActiveSection('personalInfo')}
                >
                  Personal Info
                </li>
                <li 
                  className={`cursor-pointer p-2 rounded-lg transition-colors ${activeSection === 'traits' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  onClick={() => setActiveSection('traits')}
                >
                  Traits
                </li>
                <li 
                  className={`cursor-pointer p-2 rounded-lg transition-colors ${activeSection === 'favorites' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  onClick={() => setActiveSection('favorites')}
                >
                  Favorites
                </li>
                <li 
                  className={`cursor-pointer p-2 rounded-lg transition-colors ${activeSection === 'languages' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  onClick={() => setActiveSection('languages')}
                >
                  Languages
                </li>
                <li 
                  className={`cursor-pointer p-2 rounded-lg transition-colors ${activeSection === 'memories' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  onClick={() => setActiveSection('memories')}
                >
                  Memories
                </li>
                <li 
                  className={`cursor-pointer p-2 rounded-lg transition-colors ${activeSection === 'relationships' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  onClick={() => setActiveSection('relationships')}
                >
                  Relationships
                </li>
              </ul>
            </div>

            <div className="w-3/4 pl-4 border-l border-gray-200 dark:border-gray-700">
              {activeSection === 'personalInfo' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                      <input
                        type="text"
                        value={updatedTemplate.personalInfo.name.firstName || ''}
                        onChange={(e) => updatePersonalInfo('name.firstName', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                      <input
                        type="text"
                        value={updatedTemplate.personalInfo.name.lastName || ''}
                        onChange={(e) => updatePersonalInfo('name.lastName', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Name</label>
                      <input
                        type="text"
                        value={updatedTemplate.personalInfo.name.preferredName || ''}
                        onChange={(e) => updatePersonalInfo('name.preferredName', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                      <input
                        type="text"
                        value={updatedTemplate.personalInfo.dateOfBirth || ''}
                        onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Passing</label>
                      <input
                        type="text"
                        value={updatedTemplate.personalInfo.dateOfPassing || ''}
                        onChange={(e) => updatePersonalInfo('dateOfPassing', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                      <input
                        type="text"
                        value={updatedTemplate.personalInfo.gender || ''}
                        onChange={(e) => updatePersonalInfo('gender', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'traits' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Traits</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">MBTI</label>
                    <input
                      type="text"
                      value={updatedTemplate.traits.personality.mbti || ''}
                      onChange={(e) => updateTraits('personality.mbti', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Strengths (comma separated)</label>
                    <input
                      type="text"
                      value={updatedTemplate.traits.personality.strengths.filter(Boolean).join(', ')}
                      onChange={(e) => updateTraits('personality.strengths', e.target.value.split(',').map(s => s.trim()))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Challenges (comma separated)</label>
                    <input
                      type="text"
                      value={updatedTemplate.traits.personality.challenges.filter(Boolean).join(', ')}
                      onChange={(e) => updateTraits('personality.challenges', e.target.value.split(',').map(s => s.trim()))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interests (comma separated)</label>
                    <input
                      type="text"
                      value={updatedTemplate.traits.interests.filter(Boolean).join(', ')}
                      onChange={(e) => updateTraits('interests', e.target.value.split(',').map(s => s.trim()))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Values (comma separated)</label>
                    <input
                      type="text"
                      value={updatedTemplate.traits.values.filter(Boolean).join(', ')}
                      onChange={(e) => updateTraits('values', e.target.value.split(',').map(s => s.trim()))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mannerisms (comma separated)</label>
                    <input
                      type="text"
                      value={updatedTemplate.traits.mannerisms.filter(Boolean).join(', ')}
                      onChange={(e) => updateTraits('mannerisms', e.target.value.split(',').map(s => s.trim()))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'favorites' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Favorites</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Colors (comma separated)</label>
                    <input
                      type="text"
                      value={updatedTemplate.favorites.colors.filter(Boolean).join(', ')}
                      onChange={(e) => updateFavorites('colors', e.target.value.split(',').map(s => s.trim()))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Foods (comma separated)</label>
                    <input
                      type="text"
                      value={updatedTemplate.favorites.foods.filter(Boolean).join(', ')}
                      onChange={(e) => updateFavorites('foods', e.target.value.split(',').map(s => s.trim()))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Movies (comma separated)</label>
                    <input
                      type="text"
                      value={updatedTemplate.favorites.movies.filter(Boolean).join(', ')}
                      onChange={(e) => updateFavorites('movies', e.target.value.split(',').map(s => s.trim()))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Books (comma separated)</label>
                    <input
                      type="text"
                      value={updatedTemplate.favorites.books.filter(Boolean).join(', ')}
                      onChange={(e) => updateFavorites('books', e.target.value.split(',').map(s => s.trim()))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Music Genres (comma separated)</label>
                    <input
                      type="text"
                      value={updatedTemplate.favorites.music.genres.filter(Boolean).join(', ')}
                      onChange={(e) => updateFavorites('music.genres', e.target.value.split(',').map(s => s.trim()))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Music Artists (comma separated)</label>
                    <input
                      type="text"
                      value={updatedTemplate.favorites.music.artists.filter(Boolean).join(', ')}
                      onChange={(e) => updateFavorites('music.artists', e.target.value.split(',').map(s => s.trim()))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'languages' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Languages</h3>
                  
                  {updatedTemplate.languages.language.map((language, index) => (
                    <div key={index} className="p-3 border rounded-md mb-3">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">Language {index + 1}</h4>
                        <button 
                          onClick={() => removeLanguage(index)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                          <input
                            type="text"
                            value={language.name || ''}
                            onChange={(e) => updateLanguages(index, 'name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proficiency</label>
                          <input
                            type="text"
                            value={language.proficiency || ''}
                            onChange={(e) => updateLanguages(index, 'proficiency', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={addLanguage}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add Language
                  </button>
                </div>
              )}

              {activeSection === 'memories' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Memories</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Significant Events</h4>
                    {updatedTemplate.memories.significantEvents.map((event, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={event || ''}
                          onChange={(e) => updateMemories('significantEvents', index, e.target.value)}
                          className="flex-grow rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                        />
                        <button 
                          onClick={() => removeMemory('significantEvents', index)}
                          className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addMemory('significantEvents')}
                      className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add Event
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Shared Experiences</h4>
                    {updatedTemplate.memories.sharedExperiences.map((experience, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={experience || ''}
                          onChange={(e) => updateMemories('sharedExperiences', index, e.target.value)}
                          className="flex-grow rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                        />
                        <button 
                          onClick={() => removeMemory('sharedExperiences', index)}
                          className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addMemory('sharedExperiences')}
                      className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add Experience
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Family Members</h4>
                    {updatedTemplate.memories.familyMembers.map((member, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={member || ''}
                          onChange={(e) => updateMemories('familyMembers', index, e.target.value)}
                          className="flex-grow rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                        />
                        <button 
                          onClick={() => removeMemory('familyMembers', index)}
                          className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addMemory('familyMembers')}
                      className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add Family Member
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Personal Stories</h4>
                    {updatedTemplate.memories.personalStories.map((story, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={story || ''}
                          onChange={(e) => updateMemories('personalStories', index, e.target.value)}
                          className="flex-grow rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                        />
                        <button 
                          onClick={() => removeMemory('personalStories', index)}
                          className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addMemory('personalStories')}
                      className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add Story
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'relationships' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Relationships</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Family</h4>
                    {updatedTemplate.relationships.family.map((member, index) => (
                      <div key={index} className="p-3 border rounded-md mb-3">
                        <div className="flex justify-between mb-2">
                          <h5 className="font-medium">Family Member {index + 1}</h5>
                          <button 
                            onClick={() => removeRelationship('family', index)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input
                              type="text"
                              value={member.name || ''}
                              onChange={(e) => updateRelationship('family', index, 'name', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Relation</label>
                            <input
                              type="text"
                              value={member.relation || ''}
                              onChange={(e) => updateRelationship('family', index, 'relation', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Details</label>
                            <textarea
                              value={member.details || ''}
                              onChange={(e) => updateRelationship('family', index, 'details', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => addRelationship('family')}
                      className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add Family Member
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Friends</h4>
                    {updatedTemplate.relationships.friends.map((friend, index) => (
                      <div key={index} className="p-3 border rounded-md mb-3">
                        <div className="flex justify-between mb-2">
                          <h5 className="font-medium">Friend {index + 1}</h5>
                          <button 
                            onClick={() => removeRelationship('friends', index)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input
                              type="text"
                              value={friend.name || ''}
                              onChange={(e) => updateRelationship('friends', index, 'name', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Details</label>
                            <textarea
                              value={friend.details || ''}
                              onChange={(e) => updateRelationship('friends', index, 'details', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => addRelationship('friends')}
                      className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add Friend
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOverlay;
                                    

'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

const CATEGORIES = [
  { value: 'galaxies', label: 'Galaxies' },
  { value: 'galaxy-clusters', label: 'Galaxy Clusters' },
  { value: 'star-clusters', label: 'Star Clusters' },
  { value: 'nebulae', label: 'Nebulae' },
  { value: 'supernovae', label: 'Supernovae' },
  { value: 'asteroids', label: 'Asteroids' },
  { value: 'exoplanets', label: 'Exoplanets' },
  { value: 'travel', label: 'Travel Photos' },
];

const OBSERVATORIES = [
  { value: 'H85', label: 'H85 - Silver Spring Observatory' },
  { value: 'BBO', label: 'BBO - Blackbird Observatory' },
  { value: 'SRO', label: 'SRO - Sierra Remote Observatories' },
  { value: 'G53', label: 'G53 - Alder Springs Observatory' },
  { value: 'TAS', label: 'TAS - Texas Astronomical Society Dark Site' },
  { value: 'None', label: 'None / Not Applicable' },
];

interface ImageUploadFormProps {
  onSuccess?: () => void;
}

export default function ImageUploadForm({ onSuccess }: ImageUploadFormProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    designation: '',
    name: '',
    category: 'galaxies',
    observatory: 'SRO',
    filters: '',
    description: '',
    featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage({ type: 'error', text: 'Please select an image to upload' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Generate unique filename
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${formData.category}/${Date.now()}-${formData.designation.replace(/\s+/g, '_')}.${fileExt}`;
      
      // Upload image to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      // Insert image record into database
      const { error: dbError } = await supabase
        .from('images')
        .insert({
          designation: formData.designation,
          name: formData.name || null,
          category: formData.category,
          observatory: formData.observatory,
          filters: formData.filters || null,
          description: formData.description || null,
          image_path: publicUrl,
          thumbnail_path: publicUrl, // Same for now, could generate thumbnails later
          featured: formData.featured,
        });

      if (dbError) {
        throw dbError;
      }

      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      
      // Reset form
      setFormData({
        designation: '',
        name: '',
        category: 'galaxies',
        observatory: 'SRO',
        filters: '',
        description: '',
        featured: false,
      });
      setImageFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onSuccess?.();
    } catch (error: unknown) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-space-50 mb-6">Upload New Image</h2>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-space-200 mb-2">
          Image File *
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-3 bg-space-900 border border-space-600 rounded-lg text-space-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-nebula-blue file:text-space-900 file:font-semibold hover:file:bg-nebula-cyan"
          required
        />
        {preview && (
          <div className="mt-4 relative aspect-video max-w-md rounded-lg overflow-hidden border border-space-600">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* Grid for form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Designation */}
        <div>
          <label htmlFor="designation" className="block text-sm font-medium text-space-200 mb-2">
            Designation * (e.g., M51, NGC 4565)
          </label>
          <input
            id="designation"
            type="text"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="w-full px-4 py-3 bg-space-900 border border-space-600 rounded-lg text-space-100 placeholder-space-500 focus:outline-none focus:ring-2 focus:ring-nebula-blue"
            placeholder="M51"
            required
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-space-200 mb-2">
            Common Name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-space-900 border border-space-600 rounded-lg text-space-100 placeholder-space-500 focus:outline-none focus:ring-2 focus:ring-nebula-blue"
            placeholder="Whirlpool Galaxy"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-space-200 mb-2">
            Category *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 bg-space-900 border border-space-600 rounded-lg text-space-100 focus:outline-none focus:ring-2 focus:ring-nebula-blue"
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Observatory */}
        <div>
          <label htmlFor="observatory" className="block text-sm font-medium text-space-200 mb-2">
            Observatory *
          </label>
          <select
            id="observatory"
            value={formData.observatory}
            onChange={(e) => setFormData({ ...formData, observatory: e.target.value })}
            className="w-full px-4 py-3 bg-space-900 border border-space-600 rounded-lg text-space-100 focus:outline-none focus:ring-2 focus:ring-nebula-blue"
            required
          >
            {OBSERVATORIES.map((obs) => (
              <option key={obs.value} value={obs.value}>
                {obs.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filters */}
        <div>
          <label htmlFor="filters" className="block text-sm font-medium text-space-200 mb-2">
            Filters (optional)
          </label>
          <input
            id="filters"
            type="text"
            value={formData.filters}
            onChange={(e) => setFormData({ ...formData, filters: e.target.value })}
            className="w-full px-4 py-3 bg-space-900 border border-space-600 rounded-lg text-space-100 placeholder-space-500 focus:outline-none focus:ring-2 focus:ring-nebula-blue"
            placeholder="LRGB, Ha, OIII..."
          />
        </div>

        {/* Featured */}
        <div className="flex items-center">
          <input
            id="featured"
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-5 h-5 rounded bg-space-900 border-space-600 text-nebula-blue focus:ring-nebula-blue"
          />
          <label htmlFor="featured" className="ml-3 text-sm font-medium text-space-200">
            Feature on homepage
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-space-200 mb-2">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-space-900 border border-space-600 rounded-lg text-space-100 placeholder-space-500 focus:outline-none focus:ring-2 focus:ring-nebula-blue resize-none"
          placeholder="Additional details about the image..."
        />
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-900/30 border border-green-700/50 text-green-400' 
            : 'bg-red-900/30 border border-red-700/50 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-nebula-blue text-space-900 font-semibold rounded-lg hover:bg-nebula-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
    </form>
  );
}


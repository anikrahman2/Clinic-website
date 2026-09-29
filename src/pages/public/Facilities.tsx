import { useState, useEffect } from 'react';
import { Building2, Image as ImageIcon, CheckCircle, ShieldCheck, X, ZoomIn } from 'lucide-react';
import { api } from '../../services/api.js';
import type { Facility, GalleryItem } from '../../types/index.js';

export function Facilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'facilities' | 'gallery'>('facilities');
  const [previewImage, setPreviewImage] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getFacilities({ activeOnly: true }),
      api.getGallery({ activeOnly: true }),
    ])
      .then(([facRes, galRes]) => {
        if (facRes.success && Array.isArray(facRes.data)) setFacilities(facRes.data);
        if (galRes.success && Array.isArray(galRes.data)) setGallery(galRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const galleryCategories = [
    'All',
    ...Array.from(new Set(gallery.map((g) => g.category).filter(Boolean))),
  ];

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter((g) => g.category === selectedCategory);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            Infrastructure & Technology
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Hospital Facilities & Visual Gallery
          </h1>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Take a tour through Jharna Clinic & Hospital in Jashore. Explore our sterile surgical theaters, diagnostic equipment, patient recovery cabins, and emergency care infrastructure.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-2xl shadow-xs mt-6">
            <button
              onClick={() => setActiveTab('facilities')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'facilities'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Clinical Facilities
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'gallery'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Photo Gallery
            </button>
          </div>
        </div>

        {/* Facilities Tab Content */}
        {activeTab === 'facilities' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.map((facility) => (
                <div
                  key={facility._id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={facility.image}
                      alt={facility.title}
                      className="w-full h-52 object-cover"
                    />
                    <div className="p-6">
                      <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 uppercase tracking-wider">
                        {facility.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-xl mt-3">{facility.title}</h3>
                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {facility.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 text-xs text-emerald-700 font-semibold flex items-center gap-1.5 border-t border-slate-100 pt-3">
                    <ShieldCheck className="w-4 h-4" />
                    Operational 24/7 with trained attendants
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Tab Content */}
        {activeTab === 'gallery' && (
          <div>
            {/* Category Filter */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition ${
                    selectedCategory === cat
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setPreviewImage(item)}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                    <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-base mt-1">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-[11px] text-teal-300 font-semibold mt-2">
                      <ZoomIn className="w-3.5 h-3.5" /> Click to enlarge
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 z-10 bg-slate-950/70 hover:bg-slate-950 text-white p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewImage.image}
                alt={previewImage.title}
                className="w-full max-h-[75vh] object-contain bg-black"
              />
              <div className="p-6 text-white bg-slate-900">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  {previewImage.category}
                </span>
                <h3 className="text-xl font-bold mt-1">{previewImage.title}</h3>
                {previewImage.description && (
                  <p className="text-sm text-slate-300 mt-1">{previewImage.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

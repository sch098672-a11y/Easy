import React, { useState, useRef } from 'react';
import { 
  X, Search, Plus, Edit2, Save, RotateCcw, Download, 
  Upload, Check, AlertCircle, Trash2, ExternalLink, Image as ImageIcon,
  DollarSign, Package, Tag, Eye, ArrowLeft, Sliders
} from 'lucide-react';
import { Product } from '../types';
import { formatNaira, calculateDiscount, calculateSavings, getStockStatus } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';
import { optimizeImageFile, saveProductImage } from '../utils/imageStorage';

interface ProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (updatedProducts: Product[]) => void;
  onResetCatalogue: () => void;
}

type TabType = 'info' | 'pricing' | 'inventory' | 'images' | 'marketing' | 'status';

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  onResetCatalogue
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const stock = Number(p.stock) || 0;
    const matchesStock = 
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && stock > 5) ||
      (stockFilter === 'low_stock' && stock > 0 && stock <= 5) ||
      (stockFilter === 'out_of_stock' && stock <= 0);

    return matchesSearch && matchesCat && matchesStock;
  });

  const handleStartEdit = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setActiveTab('info');
  };

  const handleCreateNewProduct = () => {
    const nextNum = products.length + 1;
    const id = `EASY-${nextNum.toString().padStart(3, '0')}`;
    const newProd: Product = {
      id,
      sku: `EL-${nextNum.toString().padStart(3, '0')}`,
      name: '',
      brand: 'EASYLIFE',
      category: 'groceries',
      description: '',
      image: '',
      images: [],
      originalPrice: 0,
      salePrice: 0,
      stock: 20,
      rating: 5.0,
      reviewCount: 0,
      reviews: 0,
      badge: 'NEW',
      featured: false,
      bestSeller: false,
      isNew: true,
      availability: 'IN STOCK',
      tags: [],
      features: [],
      specs: {}
    };
    setEditingProduct(newProd);
    setActiveTab('info');
  };

  const handleSaveCurrentProduct = () => {
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) {
      alert('Product name is required');
      return;
    }

    const updated = {
      ...editingProduct,
      originalPrice: Number(editingProduct.originalPrice) || 0,
      salePrice: Number(editingProduct.salePrice) || 0,
      stock: Number(editingProduct.stock) || 0,
      availability: getStockStatus(Number(editingProduct.stock) || 0),
      discount: calculateDiscount(editingProduct.originalPrice, editingProduct.salePrice)
    };

    const exists = products.some((p) => p.id === updated.id);
    let newCatalogue: Product[];
    if (exists) {
      newCatalogue = products.map((p) => (p.id === updated.id ? updated : p));
    } else {
      newCatalogue = [updated, ...products];
    }

    onSaveProducts(newCatalogue);
    setEditingProduct(null);
    showToast(`Saved "${updated.name}" successfully!`);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm(`Are you sure you want to remove product ${id}?`)) {
      const newCatalogue = products.filter((p) => p.id !== id);
      onSaveProducts(newCatalogue);
      if (editingProduct?.id === id) setEditingProduct(null);
      showToast(`Removed product ${id}`);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `easylife-catalogue-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported catalogue to JSON');
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    try {
      showToast(`Optimizing & attaching photograph to ${editingProduct.id}...`);
      const dataUrl = await optimizeImageFile(file);
      await saveProductImage(editingProduct.id, dataUrl);

      setEditingProduct({
        ...editingProduct,
        image: dataUrl,
        images: editingProduct.images?.length ? [dataUrl, ...editingProduct.images.slice(1)] : [dataUrl]
      });
      showToast(`Real photograph attached to ${editingProduct.id} and saved!`);
    } catch (err) {
      console.error('Image processing failed:', err);
      showToast('Failed to process image file');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col my-4 max-h-[94vh]">
        
        {/* TOP BAR */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
              EL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base sm:text-lg tracking-wide">
                  EASYLIFE Product Manager
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Store Owner Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Central catalogue ({products.length} Products) • Instant Real-Time Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              title="Export catalogue backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset catalogue back to initial 60 starter products? Any custom edits will be restored.')) {
                  onResetCatalogue();
                  setEditingProduct(null);
                  showToast('Catalogue reset to initial 60 products');
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              title="Restore original 60 starter products"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close manager"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="bg-emerald-700 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* MAIN BODY: SPLIT VIEW OR EDIT VIEW */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* VIEW A: WHEN EDITING A PRODUCT */}
          {editingProduct ? (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
              
              {/* EDIT SUB-HEADER */}
              <div className="p-3 sm:p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Catalogue List</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    ID: {editingProduct.id}
                  </span>
                  <button
                    onClick={handleSaveCurrentProduct}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-display font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE CHANGES</span>
                  </button>
                </div>
              </div>

              {/* 6 SECTION TABS REQUIRED BY SECTION 23 */}
              <div className="flex border-b border-slate-200 bg-white px-4 overflow-x-auto">
                {(
                  [
                    { id: 'info', label: '1. PRODUCT INFORMATION' },
                    { id: 'pricing', label: '2. PRICING' },
                    { id: 'inventory', label: '3. INVENTORY' },
                    { id: 'images', label: '4. IMAGES' },
                    { id: 'marketing', label: '5. MARKETING' },
                    { id: 'status', label: '6. STATUS & PREVIEW' }
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-emerald-600 text-emerald-800'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT AREA */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                
                {/* 1. PRODUCT INFORMATION */}
                {activeTab === 'info' && (
                  <div className="max-w-3xl space-y-4 bg-white p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-display font-bold text-sm text-slate-900 border-b pb-2">
                      Product Core Information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          placeholder="e.g. Big Bull Premium Parboiled Rice 50kg"
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Brand *
                        </label>
                        <input
                          type="text"
                          value={editingProduct.brand}
                          onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                          placeholder="e.g. Big Bull, Golden Penny, Knorr"
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Category *
                        </label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600"
                        >
                          <option value="groceries">Groceries</option>
                          <option value="beverages">Beverages</option>
                          <option value="health-wellness">Health & Wellness</option>
                          <option value="personal-care">Personal Care</option>
                          <option value="beauty">Beauty</option>
                          <option value="household">Household</option>
                          <option value="snacks">Snacks</option>
                          <option value="baby-kids">Baby & Kids</option>
                          <option value="deals">Deals</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          SKU (Stock Keeping Unit)
                        </label>
                        <input
                          type="text"
                          value={editingProduct.sku || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                          placeholder="e.g. EL-001"
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Packaging / Unit Description
                      </label>
                      <input
                        type="text"
                        value={editingProduct.unit || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                        placeholder="e.g. 50kg Bag, 500g Pack, Bottle, 4-Pack"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Product Description
                      </label>
                      <textarea
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        rows={4}
                        placeholder="Detailed description of benefits, quality, ingredients, and usage instructions..."
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Search Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.tags?.join(', ') || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          })
                        }
                        placeholder="rice, parboiled, 50kg, big bull, staples"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}

                {/* 2. PRICING */}
                {activeTab === 'pricing' && (
                  <div className="max-w-3xl space-y-4 bg-white p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-display font-bold text-sm text-slate-900 border-b pb-2">
                      Pricing & Discount Configuration
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Original Price (₦) *
                        </label>
                        <input
                          type="number"
                          value={editingProduct.originalPrice}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              originalPrice: Math.max(0, Number(e.target.value))
                            })
                          }
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-bold"
                        />
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Preview: {formatNaira(editingProduct.originalPrice)}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Sale Price (₦) *
                        </label>
                        <input
                          type="number"
                          value={editingProduct.salePrice}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              salePrice: Math.max(0, Number(e.target.value))
                            })
                          }
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-bold text-emerald-800"
                        />
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Preview: {formatNaira(editingProduct.salePrice)}
                        </span>
                      </div>
                    </div>

                    {/* LIVE AUTOMATED DISCOUNT CALCULATION PREVIEW */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-600">Calculated Discount:</span>
                        <span className={calculateDiscount(editingProduct.originalPrice, editingProduct.salePrice) > 0 ? 'text-rose-600 font-black' : 'text-slate-400'}>
                          {calculateDiscount(editingProduct.originalPrice, editingProduct.salePrice)}% OFF
                        </span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-600">Customer Savings:</span>
                        <span className="text-emerald-700">
                          {formatNaira(calculateSavings(editingProduct.originalPrice, editingProduct.salePrice))}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                        * Note: If Original Price equals Sale Price, no discount badge or strikethrough price will be displayed on the store.
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. INVENTORY */}
                {activeTab === 'inventory' && (
                  <div className="max-w-3xl space-y-4 bg-white p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-display font-bold text-sm text-slate-900 border-b pb-2">
                      Inventory & Stock Management
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current Physical Stock Units *
                      </label>
                      <input
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            stock: Math.max(0, parseInt(e.target.value) || 0)
                          })
                        }
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-bold"
                      />
                    </div>

                    {/* STOCK STATUS BOX */}
                    <div className="p-4 rounded-xl border space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">Computed Status:</span>
                        {editingProduct.stock <= 0 ? (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                            OUT OF STOCK
                          </span>
                        ) : editingProduct.stock <= 5 ? (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">
                            LOW STOCK (Only {editingProduct.stock} left)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            IN STOCK ({editingProduct.stock} available)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        When stock reaches 0, the store automatically marks the product as Out of Stock, disables Add to Cart & Buy Now buttons, and prevents customers from adding it to their cart.
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. IMAGES */}
                {activeTab === 'images' && (
                  <div className="max-w-3xl space-y-4 bg-white p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-display font-bold text-sm text-slate-900 border-b pb-2">
                      Product Photograph Management
                    </h4>

                    <p className="text-xs text-slate-600">
                      Per store instructions, upload your real product photograph. The system will display it using professional <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">object-fit: contain</code> without cropping or distortion.
                    </p>

                    {/* Upload button & input */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-2xl">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>UPLOAD PRODUCT IMAGE</span>
                      </button>
                      <span className="text-xs text-slate-500">
                        Select real photograph from iPhone or device (saves persistently)
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Image URL / File Path
                      </label>
                      <input
                        type="text"
                        value={editingProduct.image}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        placeholder="e.g. /products/IMG_2724.jpeg or https://..."
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-mono"
                      />
                    </div>

                    {/* IMAGE PREVIEW */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-700 block mb-2">
                        Live Image Preview:
                      </span>
                      <div className="w-40 h-40 border border-slate-300 rounded-xl bg-white overflow-hidden">
                        <ProductImage
                          src={editingProduct.image}
                          alt={editingProduct.name || 'Preview'}
                          brand={editingProduct.brand}
                          productId={editingProduct.id}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. MARKETING */}
                {activeTab === 'marketing' && (
                  <div className="max-w-3xl space-y-4 bg-white p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-display font-bold text-sm text-slate-900 border-b pb-2">
                      Marketing & Visibility Badges
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Display Badge
                      </label>
                      <select
                        value={editingProduct.badge || 'NONE'}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            badge: e.target.value === 'NONE' ? undefined : e.target.value
                          })
                        }
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600"
                      >
                        <option value="NONE">None</option>
                        <option value="SALE">SALE</option>
                        <option value="NEW">NEW</option>
                        <option value="BEST SELLER">BEST SELLER</option>
                        <option value="FEATURED">FEATURED</option>
                        <option value="POPULAR">POPULAR</option>
                        <option value="LIMITED">LIMITED</option>
                        <option value="FLASH DEAL">FLASH DEAL</option>
                      </select>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="flex items-center gap-3 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(editingProduct.featured)}
                          onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600"
                        />
                        <span>Featured Product (Display in Homepage Featured highlights)</span>
                      </label>

                      <label className="flex items-center gap-3 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(editingProduct.bestSeller)}
                          onChange={(e) => setEditingProduct({ ...editingProduct, bestSeller: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600"
                        />
                        <span>Best Seller (Display in Best Sellers section)</span>
                      </label>

                      <label className="flex items-center gap-3 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(editingProduct.isNew)}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600"
                        />
                        <span>New Arrival (Show in New arrivals section)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 6. STATUS & PREVIEW */}
                {activeTab === 'status' && (
                  <div className="max-w-3xl space-y-4 bg-white p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-display font-bold text-sm text-slate-900 border-b pb-2">
                      Product Status & Card Preview
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-600 block mb-1">Permanent ID:</span>
                          <span className="font-mono font-bold text-slate-900">{editingProduct.id}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-600 block mb-1">SKU:</span>
                          <span className="font-mono font-bold text-slate-900">{editingProduct.sku || 'N/A'}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-600 block mb-1">Stock Level:</span>
                          <span className="font-bold text-slate-900">{editingProduct.stock} units</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-600 block mb-1">Price Configuration:</span>
                          <span className="font-bold text-slate-900">
                            {formatNaira(editingProduct.salePrice)} (was {formatNaira(editingProduct.originalPrice)})
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-700 block mb-2">
                          Store Preview:
                        </span>
                        <div className="w-56 border rounded-2xl overflow-hidden shadow-xs bg-white">
                          <div className="w-full pt-[100%] relative bg-white border-b">
                            <div className="absolute inset-0">
                              <ProductImage
                                src={editingProduct.image}
                                alt={editingProduct.name || 'Preview'}
                                brand={editingProduct.brand}
                                productId={editingProduct.id}
                              />
                            </div>
                          </div>
                          <div className="p-3 text-xs">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                              {editingProduct.brand}
                            </span>
                            <h5 className="font-bold text-slate-900 line-clamp-1 mt-0.5">
                              {editingProduct.name || 'Untitled Product'}
                            </h5>
                            <span className="font-black text-slate-900 block mt-1">
                              {formatNaira(editingProduct.salePrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                      <button
                        onClick={handleSaveCurrentProduct}
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-display font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        SAVE AND FINISH
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            
            /* VIEW B: BROWSE ALL PRODUCTS LIST */
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* FILTERS & SEARCH HEADER */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                
                {/* Search input */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, brand, SKU or ID..."
                    className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Category filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs py-2 px-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
                >
                  <option value="all">All Categories</option>
                  <option value="groceries">Groceries</option>
                  <option value="beverages">Beverages</option>
                  <option value="health-wellness">Health & Wellness</option>
                  <option value="personal-care">Personal Care</option>
                  <option value="beauty">Beauty</option>
                  <option value="household">Household</option>
                  <option value="snacks">Snacks</option>
                  <option value="baby-kids">Baby & Kids</option>
                  <option value="deals">Deals</option>
                </select>

                {/* Stock filter */}
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="text-xs py-2 px-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
                >
                  <option value="all">All Stock Status</option>
                  <option value="in_stock">In Stock (&gt;5)</option>
                  <option value="low_stock">Low Stock (1-5)</option>
                  <option value="out_of_stock">Out of Stock (0)</option>
                </select>

                {/* Add Product Button */}
                <button
                  onClick={handleCreateNewProduct}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-display font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD NEW PRODUCT</span>
                </button>
              </div>

              {/* PRODUCTS TABLE */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-black tracking-wider sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Photo</th>
                      <th className="py-3 px-3">ID / SKU</th>
                      <th className="py-3 px-3">Product Name & Brand</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Sale Price</th>
                      <th className="py-3 px-3">Orig. Price</th>
                      <th className="py-3 px-3">Stock Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredProducts.map((p) => {
                      const stock = Number(p.stock) || 0;
                      const isOutOfStock = stock <= 0;
                      const isLow = stock > 0 && stock <= 5;
                      const discount = calculateDiscount(p.originalPrice, p.salePrice);

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-4">
                            <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white overflow-hidden">
                              <ProductImage src={p.image} alt={p.name} brand={p.brand} productId={p.id} />
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            <div className="font-bold text-slate-900">{p.id}</div>
                            <div className="text-[10px] text-slate-400">{p.sku || '-'}</div>
                          </td>
                          <td className="py-2.5 px-3 max-w-xs">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                              {p.brand}
                            </span>
                            <div className="font-semibold text-slate-900 line-clamp-1">{p.name}</div>
                            {p.flaggedDuplicate && (
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1 py-0.5 rounded">
                                Duplicate Flagged
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 capitalize text-slate-600">
                            {p.category.replace('-', ' ')}
                          </td>
                          <td className="py-2.5 px-3 font-black text-slate-900">
                            {formatNaira(p.salePrice)}
                            {discount > 0 && (
                              <span className="ml-1 text-[10px] text-rose-600 font-bold">
                                -{discount}%
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {p.originalPrice > p.salePrice ? formatNaira(p.originalPrice) : '-'}
                          </td>
                          <td className="py-2.5 px-3">
                            {isOutOfStock ? (
                              <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded text-[10px]">
                                OUT OF STOCK (0)
                              </span>
                            ) : isLow ? (
                              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                                LOW ({stock})
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                                IN STOCK ({stock})
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

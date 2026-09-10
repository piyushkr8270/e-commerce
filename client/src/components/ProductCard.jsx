import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, Star, Share2, Copy, Check, QrCode } from 'lucide-react';

export const ProductCard = ({ product, onAddToCart, onShare }) => {
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Safe destructuring defaults
  const {
    _id,
    name = "Premium Product",
    price = 0.00,
    originalPrice,
    images = [],
    category = "General",
    description = "No description available.",
    ratings = 4.5,
    numReviews = 12,
    offerLabel
  } = product || {};

  const imageUrl = images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";
  const itemLink = `${window.location.origin}/product/${_id}`;

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(itemLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="group overflow-hidden rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-white">
      {/* Product Image & Badge */}
      <div className="relative overflow-hidden bg-slate-50 aspect-square">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Category & Offers Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 items-start">
          <Badge variant="secondary" className="bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-bold tracking-wide uppercase border border-slate-200/50 shadow-sm rounded-md px-2 py-0.5 hover:bg-white/95">
            {category}
          </Badge>
          {offerLabel && (
            <Badge variant="destructive" className="bg-rose-500 hover:bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm rounded-md border-none px-2 py-0.5">
              {offerLabel}
            </Badge>
          )}
          {ratings >= 4.7 && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm rounded-md border-none px-2 py-0.5">
              Best Seller
            </Badge>
          )}
        </div>

        {/* Share Dropdown Trigger overlay */}
        <div className="absolute top-3 right-3 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-white/50 flex items-center justify-center text-slate-600 hover:text-primary hover:scale-105 active:scale-95 transition shadow-sm outline-none"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 bg-white rounded-xl shadow-lg border border-slate-100 p-1">
              <DropdownMenuItem 
                onClick={handleCopyLink}
                className="cursor-pointer hover:bg-slate-50 flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700"
              >
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-slate-100" />

              <DropdownMenuItem className="p-0">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent('Check this product: ' + itemLink)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-3 py-2 hover:bg-slate-50 text-xs font-bold text-slate-700 block transition"
                >
                  WhatsApp
                </a>
              </DropdownMenuItem>

              {onShare && (
                <>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    onClick={() => onShare(product)}
                    className="cursor-pointer hover:bg-slate-50 flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700"
                  >
                    <span>Scan QR Code</span>
                    <QrCode className="w-3 h-3 text-slate-400" />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="p-4 pb-0">
        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
          </div>
          <span className="text-xs font-bold text-slate-700">{Number(ratings).toFixed(1)}</span>
          <span className="text-slate-400 text-[10px]">({numReviews})</span>
        </div>

        <CardTitle className="font-bold text-slate-800 text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-1 flex-grow">
        <CardDescription className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-medium">
          {description}
        </CardDescription>
      </CardContent>

      <CardFooter className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <span className="text-slate-400 text-[9px] block font-bold uppercase tracking-wider">Price</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-900">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-xs text-slate-400 line-through font-bold">${originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>

        <Button
          onClick={handleAdd}
          variant={added ? "default" : "secondary"}
          className={`h-9 px-4 rounded-xl text-xs font-bold transition active:scale-95 flex items-center gap-1.5 ${
            added 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
              : 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white'
          }`}
        >
          {added ? 'Added!' : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

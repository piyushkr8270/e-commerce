import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, updateQuantity, removeFromCart } from '@/store/slices/cartSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartOverlay = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector(selectCart);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleQtyChange = (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ product: productId, qty: newQty }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        showCloseButton={true}
        className="fixed top-0 right-0 bottom-0 left-auto translate-x-0 translate-y-0 h-full w-full max-w-md border-l border-slate-200 bg-white p-6 shadow-2xl flex flex-col rounded-none outline-none z-50 duration-300 ease-in-out"
      >
        <DialogHeader className="border-b border-slate-100 pb-4">
          <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span>Your Cart ({cartCount})</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Review your premium items and proceed to secure checkout.
          </DialogDescription>
        </DialogHeader>

        {/* Cart Item List */}
        <div className="flex-grow overflow-y-auto py-4 space-y-4 pr-1">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Your cart is empty</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Add some premium products from our catalog to get started.
                </p>
              </div>
              <Button 
                onClick={onClose}
                variant="outline" 
                className="rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product} className="flex gap-4 p-3 rounded-xl border border-slate-100 hover:border-primary-100 transition bg-white shadow-sm">
                <img 
                  src={item.images[0]} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-lg bg-slate-50 border shrink-0" 
                />
                <div className="flex-grow min-w-0 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs truncate leading-tight">{item.name}</h5>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mt-0.5">{item.category}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity selectors */}
                    <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                      <Button
                        onClick={() => handleQtyChange(item.product, item.qty, -1)}
                        variant="ghost"
                        size="icon"
                        className="w-5.5 h-5.5 rounded-md hover:bg-white text-slate-500 hover:text-slate-800"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-xs font-extrabold text-slate-800 w-5 text-center">{item.qty}</span>
                      <Button
                        onClick={() => handleQtyChange(item.product, item.qty, 1)}
                        variant="ghost"
                        size="icon"
                        className="w-5.5 h-5.5 rounded-md hover:bg-white text-slate-500 hover:text-slate-800"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-800">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                      <Button
                        onClick={() => handleRemove(item.product)}
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50/50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-100 pt-4 mt-auto space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-xs font-semibold">Subtotal:</span>
                <span className="text-sm font-bold text-slate-900">${subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-[10px]">
                <span>Shipping &amp; Taxes:</span>
                <span className="font-semibold text-emerald-600">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                asChild
                onClick={onClose}
                className="w-full py-5.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary-500/20"
              >
                <Link to="/cart">
                  View Full Cart &amp; Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full text-slate-500 hover:text-slate-800 text-xs font-bold py-2 hover:bg-slate-50"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartOverlay;

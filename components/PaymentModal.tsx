import React, { useState } from 'react';
import { X, CreditCard, Banknote, CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { SubscriptionPlan, PaymentMethod } from '../types';

interface PaymentModalProps {
  plan: SubscriptionPlan;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose, onSuccess }) => {
  const [method, setMethod] = useState<PaymentMethod>('edahabia');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(onSuccess, 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement Réussi !</h2>
          <p className="text-gray-500">Bienvenue dans l'abonnement {plan.name}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-500 z-10"
        >
          <X size={20} />
        </button>

        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Finaliser la commande</h2>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500">{plan.name}</span>
            <span className="text-lg font-bold text-primary">{plan.price} DA</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMethod('edahabia')}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                method === 'edahabia' 
                  ? 'border-primary bg-blue-50 text-primary' 
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <CreditCard size={24} />
              <span className="font-bold text-sm">Edahabia</span>
            </button>
            <button
              onClick={() => setMethod('ccp')}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                method === 'ccp' 
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700' 
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <Banknote size={24} />
              <span className="font-bold text-sm">CCP / BaridiMob</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {method === 'edahabia' ? (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-xl text-white mb-6 shadow-md">
                    <div className="flex justify-between items-start mb-8">
                        <CreditCard className="opacity-80" />
                        <span className="font-mono text-sm opacity-80">EDAHABIA</span>
                    </div>
                    <div className="font-mono text-xl tracking-widest mb-4">•••• •••• •••• ••••</div>
                    <div className="flex justify-between text-xs opacity-80 uppercase">
                        <span>Titulaire</span>
                        <span>Exp</span>
                    </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Numéro de carte</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date Exp.</label>
                    <input type="text" placeholder="MM/YY" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC2</label>
                    <input type="text" placeholder="123" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom sur la carte</label>
                  <input type="text" placeholder="NOM PRENOM" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary" required />
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-4">
                  <div className="flex items-center gap-2 mb-2 text-yellow-800 font-bold">
                    <AlertCircle size={18} />
                    Instructions de paiement
                  </div>
                  <p className="text-sm text-yellow-700 mb-2">Veuillez effectuer un virement vers le compte suivant :</p>
                  <div className="bg-white p-3 rounded border border-yellow-200 font-mono text-sm">
                    <p className="text-gray-500 text-xs">CCP</p>
                    <p className="font-bold text-gray-900 text-lg">0012345678 <span className="text-gray-400">/</span> 99</p>
                    <p className="text-gray-500 text-xs mt-2">Nom du bénéficiaire</p>
                    <p className="font-bold text-gray-900">SARL BOOKSUMMARY</p>
                  </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Preuve de paiement</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                        <Upload size={24} className="mb-2" />
                        <span className="text-sm font-medium">Télécharger le reçu (BaridiMob/Reçu Papier)</span>
                        <input type="file" className="hidden" />
                    </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Numéro de transaction (Optionnel)</label>
                   <input type="text" placeholder="Ex: A12345678" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full mt-6 bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>Traitement...</>
              ) : (
                <>Payer {plan.price} DA</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

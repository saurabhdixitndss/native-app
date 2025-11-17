import React, { useState } from 'react';

const PaymentModal = ({ user, onClose, onConfirm }) => {
  const [amount, setAmount] = useState(user?.totalTokens || 0);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    if (amount <= 0 || amount > user.totalTokens) {
      setError('Invalid amount');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      await onConfirm(amount);
      setSuccess(true);
      
      // Auto close after success animation
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Payment failed');
      setProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(15, 15, 35, 0.98) 100%)',
        borderRadius: '24px',
        padding: success ? '60px' : '40px',
        maxWidth: '500px',
        width: '90%',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {success ? (
          // Success State
          <div style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '160px',
              height: '160px',
              margin: '0 auto 32px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 0 60px rgba(16, 185, 129, 0.6), 0 0 100px rgba(16, 185, 129, 0.3)',
              position: 'relative'
            }}>
              {/* Pulsing ring effect */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '3px solid rgba(16, 185, 129, 0.5)',
                animation: 'pulse-ring 1.5s ease-out infinite'
              }} />
              
              {/* Checkmark SVG */}
              <svg 
                width="90" 
                height="90" 
                viewBox="0 0 52 52" 
                fill="none"
                style={{
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <path
                  d="M14 27l8 8 16-18"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{
                    strokeDasharray: 48,
                    strokeDashoffset: 48,
                    animation: 'drawCheck 0.6s ease 0.3s forwards'
                  }}
                />
              </svg>
            </div>
            
            <h2 style={{
              color: '#FFFFFF',
              fontSize: '28px',
              fontWeight: '800',
              marginBottom: '12px'
            }}>
              Payment Successful!
            </h2>
            
            <p style={{
              color: '#10B981',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              {amount.toFixed(4)} Tokens Paid
            </p>
            
            <p style={{
              color: '#9CA3AF',
              fontSize: '14px'
            }}>
              Transaction completed successfully
            </p>
          </div>
        ) : (
          // Payment Form
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Close button */}
            <button
              onClick={onClose}
              disabled={processing}
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontSize: '20px',
                cursor: processing ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (!processing) {
                  e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.target.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
              }}>
                💰
              </div>
              
              <h2 style={{
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: '800',
                marginBottom: '8px'
              }}>
                Process Payment
              </h2>
              
              <p style={{
                color: '#9CA3AF',
                fontSize: '14px'
              }}>
                Confirm token payment to user
              </p>
            </div>

            {/* User Info */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: '600' }}>
                  WALLET ADDRESS
                </span>
                <p style={{
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginTop: '4px',
                  fontFamily: 'monospace'
                }}>
                  {user?.walletAddress?.substring(0, 10)}...{user?.walletAddress?.substring(user.walletAddress.length - 8)}
                </p>
              </div>
              
              <div>
                <span style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: '600' }}>
                  AVAILABLE TOKENS
                </span>
                <p style={{
                  color: '#FBBF24',
                  fontSize: '20px',
                  fontWeight: '700',
                  marginTop: '4px'
                }}>
                  {user?.totalTokens?.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Amount Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                color: '#D1D5DB',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                display: 'block'
              }}>
                Payment Amount
              </label>
              
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  max={user?.totalTokens}
                  min={0}
                  step={0.0001}
                  disabled={processing}
                  style={{
                    width: '100%',
                    padding: '16px 50px 16px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '18px',
                    fontWeight: '700',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#8B5CF6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                
                <button
                  onClick={() => setAmount(user?.totalTokens || 0)}
                  disabled={processing}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '6px 12px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#8B5CF6',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!processing) {
                      e.target.style.background = 'rgba(139, 92, 246, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(139, 92, 246, 0.2)';
                  }}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#EF4444',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={onClose}
                disabled={processing}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#D1D5DB',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!processing) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                Cancel
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={processing || amount <= 0 || amount > user?.totalTokens}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: processing 
                    ? 'rgba(139, 92, 246, 0.5)'
                    : 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: processing || amount <= 0 || amount > user?.totalTokens ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!processing && amount > 0 && amount <= user?.totalTokens) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
                }}
              >
                {processing ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid #FFFFFF',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Processing...
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    Confirm Payment
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          0% { 
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
          100% { 
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes drawCheck {
          0% {
            stroke-dashoffset: 48;
          }
          100% { 
            stroke-dashoffset: 0;
          }
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentModal;

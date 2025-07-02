import React, { useState } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { FormField } from './FormField';
import { RadioButton } from './RadioButton';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';

export const GoogleSheetsForm: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedAnswerId, setSelectedAnswerId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; answer?: string }>({});

  const { answers, loading, submitting, error, submitResponse, refetch } = useGoogleSheets();

  const validateForm = (): boolean => {
    const errors: { name?: string; answer?: string } = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!selectedAnswerId) {
      errors.answer = 'Please select an answer';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await submitResponse(name.trim(), selectedAnswerId);
    
    if (success) {
      setSubmitted(true);
      setName('');
      setSelectedAnswerId('');
      setFormErrors({});
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Loading available answers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit Your Response</h1>
          <p className="text-gray-600">Choose one of the available options below</p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={handleRetry} />
          </div>
        )}

        {submitted && (
          <div className="mb-6">
            <SuccessMessage message="Your response has been submitted successfully!" />
          </div>
        )}

        {answers.length === 0 && !loading && !error ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Options Available</h3>
            <p className="text-gray-600 mb-4">All answers have been selected. Please check back later.</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Your Name" required error={formErrors.name}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={submitting}
              />
            </FormField>

            <FormField label="Available Options" required error={formErrors.answer}>
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                {answers.map((answer) => (
                  <RadioButton
                    key={answer.id}
                    id={answer.id}
                    name="selectedAnswer"
                    value={answer.id}
                    checked={selectedAnswerId === answer.id}
                    onChange={setSelectedAnswerId}
                    disabled={submitting}
                  >
                    {answer.text}
                  </RadioButton>
                ))}
              </div>
            </FormField>

            <button
              type="submit"
              disabled={submitting || answers.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Response
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{answers.length} option{answers.length !== 1 ? 's' : ''} available</span>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { ContactFormInput, ContactFormResponse } from '../../../server/src/schema';

interface ContactSectionProps {
  onSubmit: (formData: ContactFormInput) => Promise<ContactFormResponse>;
}

const ContactSection: React.FC<ContactSectionProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ContactFormInput>({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormInput>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormInput> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.length > 255) {
      newErrors.email = 'Email must be less than 255 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors and try again');
      return;
    }

    setIsLoading(true);

    try {
      const response = await onSubmit(formData);
      
      if (response.success) {
        toast.success(response.message || 'Message sent successfully! 🎉');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        setErrors({});
      } else {
        toast.error(response.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section className="section-padding" id="contact" data-testid="contact-section">
      <div className="container">
        <header className="text-center mb-16">
          <h2 className="mb-6" data-testid="contact-title">Let's Work Together</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto" data-testid="contact-description">
            Have a project in mind? I'd love to hear about it and discuss how we can create something amazing together.
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="glass-panel p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form" noValidate>
              {/* Name field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium">
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange('name', e.target.value)
                  }
                  className={`bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-teal-400 focus:ring-teal-400/20 ${
                    errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                  }`}
                  placeholder="Your full name"
                  maxLength={100}
                  required
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  data-testid="name-input"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm" id="name-error" role="alert" data-testid="name-error">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange('email', e.target.value)
                  }
                  className={`bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-teal-400 focus:ring-teal-400/20 ${
                    errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                  }`}
                  placeholder="your.email@example.com"
                  maxLength={255}
                  required
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  data-testid="email-input"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm" id="email-error" role="alert" data-testid="email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message field */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-white font-medium">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    handleInputChange('message', e.target.value)
                  }
                  className={`bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-teal-400 focus:ring-teal-400/20 min-h-[120px] resize-none ${
                    errors.message ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                  }`}
                  placeholder="Tell me about your project, timeline, and any specific requirements..."
                  maxLength={2000}
                  required
                  aria-describedby={errors.message ? 'message-error' : 'message-counter'}
                  data-testid="message-input"
                />
                <div className="flex justify-between items-center">
                  {errors.message ? (
                    <p className="text-red-400 text-sm" id="message-error" role="alert" data-testid="message-error">
                      {errors.message}
                    </p>
                  ) : (
                    <div />
                  )}
                  <p className="text-slate-400 text-sm" id="message-counter" data-testid="message-counter">
                    {formData.message.length}/2000
                  </p>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gradient w-full py-3 text-lg rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="submit-button"
                  aria-describedby="submit-status"
                >
                  <span>
                    {isLoading ? (
                      <>
                        <div className="inline-block w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                        <span id="submit-status">Sending...</span>
                      </>
                    ) : (
                      <span id="submit-status">Send Message</span>
                    )}
                  </span>
                </Button>
              </div>
            </form>

            {/* Alternative contact info */}
            <div className="mt-12 pt-8 border-t border-white/10 text-center" data-testid="alternative-contact">
              <p className="text-slate-400 mb-4">Or reach out directly:</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:hello@alexjohnson.com" 
                  className="text-slate-300 hover:text-teal-400 transition-colors"
                  data-testid="email-link"
                >
                  📧 hello@alexjohnson.com
                </a>
                <a 
                  href="tel:+1234567890" 
                  className="text-slate-300 hover:text-teal-400 transition-colors"
                  data-testid="phone-link"
                >
                  📞 +1 (234) 567-8900
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional contact sections */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto" data-testid="contact-cards">
          <div className="glass-card p-6 text-center" data-testid="business-card">
            <div className="text-3xl mb-4" aria-hidden="true">💼</div>
            <h3 className="text-lg font-semibold text-white mb-2">Business Inquiries</h3>
            <p className="text-slate-300 text-sm">
              Looking for photography services or UI/UX design for your business? Let's discuss your needs.
            </p>
          </div>

          <div className="glass-card p-6 text-center" data-testid="collaboration-card">
            <div className="text-3xl mb-4" aria-hidden="true">🤝</div>
            <h3 className="text-lg font-semibold text-white mb-2">Collaborations</h3>
            <p className="text-slate-300 text-sm">
              Interested in collaborating on creative projects? I'm always open to exciting partnerships.
            </p>
          </div>

          <div className="glass-card p-6 text-center" data-testid="mentoring-card">
            <div className="text-3xl mb-4" aria-hidden="true">🎓</div>
            <h3 className="text-lg font-semibold text-white mb-2">Mentoring</h3>
            <p className="text-slate-300 text-sm">
              Want to learn photography or design? I offer mentoring sessions for aspiring creatives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

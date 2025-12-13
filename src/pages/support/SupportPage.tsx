import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Input,
  Link,
  Select,
  SelectItem,
  Spinner,
  Textarea
} from "@heroui/react";
import { useState } from 'react';
import {
  FaArrowRight,
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaFileAlt,
  FaHeadset,
  FaPhone,
  FaSearch,
  FaUser,
  FaWhatsapp
} from 'react-icons/fa';

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState<'contact' | 'faq' | 'resources'>('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    category: '',
    urgency: 'medium',
    message: ''
  });

  const supportCategories = [
    { key: 'billing', label: 'Billing & Payments' },
    { key: 'technical', label: 'Technical Support' },
    { key: 'account', label: 'Account Issues' },
    { key: 'feature', label: 'Feature Request' },
    { key: 'bug', label: 'Report a Bug' },
    { key: 'general', label: 'General Inquiry' }
  ];

  const urgencyLevels = [
    { key: 'low', label: 'Low - General question' },
    { key: 'medium', label: 'Medium - Need help soon' },
    { key: 'high', label: 'High - System down/critical' },
    { key: 'urgent', label: 'Urgent - Immediate assistance' }
  ];

  const faqItems = [
    {
      key: 'billing',
      title: 'Billing & Subscription',
      items: [
        {
          question: 'How do I update my payment method?',
          answer: 'You can update your payment method in the Billing section of your account settings. Go to Settings → Billing → Payment Methods to add or update your card information.'
        },
        {
          question: 'Can I change my subscription plan?',
          answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the charges accordingly.'
        },
        {
          question: 'How do I cancel my subscription?',
          answer: 'You can cancel from your account settings. Go to Settings → Billing → Subscription and click "Cancel Subscription". Your access will continue until the end of your billing period.'
        }
      ]
    },
    {
      key: 'technical',
      title: 'Technical Support',
      items: [
        {
          question: 'What are the system requirements?',
          answer: 'Our platform works on modern browsers (Chrome 90+, Firefox 88+, Safari 14+). For mobile access, use our iOS or Android app available in respective app stores.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page. We\'ll send a reset link to your email address. The link expires in 1 hour for security.'
        },
        {
          question: 'Why am I experiencing slow performance?',
          answer: 'This could be due to internet connection, browser cache, or system maintenance. Try clearing your browser cache or check our status page for ongoing issues.'
        }
      ]
    },
    {
      key: 'account',
      title: 'Account Management',
      items: [
        {
          question: 'How do I add team members?',
          answer: 'Account admins can add team members from the Team Management section. Go to Settings → Team → Invite Members to send invitations.'
        },
        {
          question: 'Can I transfer my account to someone else?',
          answer: 'Yes, account transfers can be arranged. Contact our support team with both parties\' information and we\'ll assist with the transfer process.'
        }
      ]
    }
  ];

  const resources = [
    {
      icon: FaFileAlt,
      title: 'User Guide',
      description: 'Complete guide to using our platform',
      link: '/docs/user-guide',
      type: 'PDF'
    },
    {
      icon: FaFileAlt,
      title: 'API Documentation',
      description: 'Technical documentation for developers',
      link: '/docs/api',
      type: 'Web'
    },
    {
      icon: FaFileAlt,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      link: '/tutorials',
      type: 'Video'
    },
    {
      icon: FaFileAlt,
      title: 'System Status',
      description: 'Check our platform status',
      link: '/status',
      type: 'Live'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // showAlert(alertService.success(
      //   'Message Sent!',
      //   'We\'ve received your support request and will respond within 24 hours.',
      //   5000
      // ));

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        category: '',
        urgency: 'medium',
        message: ''
      });
    } catch (error) {
      console.log('Error submitting support request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: FaPhone,
      title: 'Call Us',
      description: 'Speak directly with our support team',
      details: '+1 (800) 123-4567',
      action: 'Call Now',
      href: 'tel:+18001234567',
      availability: '24/7'
    },
    {
      icon: FaEnvelope,
      title: 'Email Us',
      description: 'Send us a detailed message',
      details: 'support@dentalapp.com',
      action: 'Send Email',
      href: 'mailto:support@dentalapp.com',
      availability: 'Response within 24 hours'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      description: 'Quick chat support',
      details: '+1 (555) 123-4567',
      action: 'Start Chat',
      href: 'https://wa.me/15551234567',
      availability: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: FaHeadset,
      title: 'Live Chat',
      description: 'Instant messaging support',
      details: 'Available on website',
      action: 'Start Chat',
      href: '#chat',
      availability: 'Mon-Fri, 8AM-8PM EST'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Get support for your dental practice management needs. Our team is here to help you succeed.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Input
                placeholder="Search help articles, documentation..."
                className="w-full pl-12 pr-4 py-3"
                startContent={<FaSearch className="text-gray-400" />}
              />
              <Button color="primary" className="absolute right-1 top-3">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-blue-50 border-0">
            <CardBody className="text-center p-6">
              <FaClock className="text-3xl text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-900">24/7</div>
              <div className="text-blue-700">Support Availability</div>
            </CardBody>
          </Card>
          <Card className="bg-green-50 border-0">
            <CardBody className="text-center p-6">
              <FaCheckCircle className="text-3xl text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-900">15 min</div>
              <div className="text-green-700">Average Response Time</div>
            </CardBody>
          </Card>
          <Card className="bg-purple-50 border-0">
            <CardBody className="text-center p-6">
              <FaHeadset className="text-3xl text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-900">98%</div>
              <div className="text-purple-700">Customer Satisfaction</div>
            </CardBody>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-foreground/10 mb-8">
          {[
            { key: 'contact', label: 'Contact Support' },
            { key: 'faq', label: 'FAQ' },
            { key: 'resources', label: 'Resources' }
          ].map((tab) => (
            <button
              key={tab.key}
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${activeTab === tab.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardBody className="p-6">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onValueChange={(value) => handleInputChange('name', value)}
                      startContent={<FaUser className="text-gray-400" />}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onValueChange={(value) => handleInputChange('email', value)}
                      startContent={<FaEnvelope className="text-gray-400" />}
                      required
                    />
                  </div>

                  <Input
                    label="Company/Practice Name"
                    placeholder="Enter your practice name"
                    value={formData.company}
                    onValueChange={(value) => handleInputChange('company', value)}
                    startContent={<FaBuilding className="text-gray-400" />}
                  />

                  <Select
                    label="Category"
                    placeholder="Select issue category"
                    selectedKeys={formData.category ? [formData.category] : []}
                    onSelectionChange={(keys) =>
                      handleInputChange('category', Array.from(keys)[0] as string)
                    }
                    required
                  >
                    {supportCategories.map((category) => (
                      <SelectItem key={category.key}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Urgency Level"
                    placeholder="How urgent is your issue?"
                    selectedKeys={[formData.urgency]}
                    onSelectionChange={(keys) =>
                      handleInputChange('urgency', Array.from(keys)[0] as string)
                    }
                  >
                    {urgencyLevels.map((level) => (
                      <SelectItem key={level.key}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Subject"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onValueChange={(value) => handleInputChange('subject', value)}
                    required
                  />

                  <Textarea
                    label="Message"
                    placeholder="Please describe your issue in detail..."
                    value={formData.message}
                    onValueChange={(value) => handleInputChange('message', value)}
                    minRows={4}
                    required
                  />

                  <Button
                    type="submit"
                    color="primary"
                    className="w-full"
                    isLoading={isSubmitting}
                    spinner={<Spinner size="sm" />}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardBody>
            </Card>

            {/* Contact Methods */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Other ways to reach us</h3>
              {contactMethods.map((method, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardBody className="p-6">
                    <div className="flex items-start gap-4">
                      <method.icon className="text-2xl text-primary-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{method.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{method.description}</p>
                        <p className="text-gray-800 font-medium">{method.details}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          <FaClock className="inline mr-1" />
                          {method.availability}
                        </p>
                      </div>
                      <Button
                        as={Link}
                        href={method.href}
                        variant="flat"
                        className="whitespace-nowrap"
                      >
                        {method.action}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 dark:text-gray-400">Find quick answers to common questions</p>
            </div>

            <Accordion variant="splitted">
              {faqItems.map((category) => (
                <AccordionItem
                  key={category.key}
                  aria-label={category.title}
                  title={
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  }
                >
                  <div className="space-y-6">
                    {category.items.map((item, index) => (
                      <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0">
                        <h4 className="font-semibold text-lg mb-2 text-gray-900">
                          {item.question}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Helpful Resources</h2>
              <p className="text-gray-600 dark:text-gray-400">Documentation and guides to help you get the most out of our platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardBody className="p-6 text-center">
                    <resource.icon className="text-3xl text-primary-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {resource.type}
                      </span>
                      <Button
                        as={Link}
                        href={resource.link}
                        variant="light"
                        size="sm"
                        endContent={<FaArrowRight />}
                      >
                        Open
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Support Banner */}
        <Card className="bg-red-50 border-red-200 mt-12">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-900 text-lg mb-1">
                  🚨 Emergency Technical Support
                </h3>
                <p className="text-red-700">
                  For critical system outages or urgent technical issues that require immediate attention
                </p>
              </div>
              <Button color="danger" variant="shadow">
                <FaPhone className="mr-2" />
                Emergency Hotline
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
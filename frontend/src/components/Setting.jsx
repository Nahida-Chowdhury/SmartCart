// Settings.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Gear, Save, Bell, Eye, Palette, Shield, Globe } from 'react-bootstrap-icons';

const Settings = () => {
  // Initialize state with default values
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: true,
    emailNotifications: true,
    soundEffects: false,
    fontSize: 'medium',
    autoSave: true,
    privacy: 'public'
  });
  
  const [saveStatus, setSaveStatus] = useState('');
  const [errors, setErrors] = useState({});

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (settings.fontSize && !['small', 'medium', 'large'].includes(settings.fontSize)) {
      newErrors.fontSize = 'Please select a valid font size';
    }
    
    if (settings.language && settings.language.length !== 2) {
      newErrors.language = 'Language code must be 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save settings to localStorage
  const saveSettings = () => {
    if (validateForm()) {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      setSaveStatus('success');
      
      // Apply theme immediately
      if (settings.theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      
      // Apply font size
      document.body.style.fontSize = 
        settings.fontSize === 'small' ? '14px' : 
        settings.fontSize === 'large' ? '18px' : '16px';
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    } else {
      setSaveStatus('error');
    }
  };

  // Reset to default settings
  const resetSettings = () => {
    const defaultSettings = {
      theme: 'light',
      language: 'en',
      notifications: true,
      emailNotifications: true,
      soundEffects: false,
      fontSize: 'medium',
      autoSave: true,
      privacy: 'public'
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    setSaveStatus('reset');
    
    // Reset applied styles
    document.body.classList.remove('dark-theme');
    document.body.style.fontSize = '16px';
    
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="d-flex align-items-center mb-4">
            <Gear size={28} className="text-primary me-2" />
            <h2 className="mb-0">Settings</h2>
          </div>
          
          {saveStatus === 'success' && (
            <Alert variant="success" className="d-flex align-items-center">
              <Save className="me-2" /> Your settings have been saved successfully!
            </Alert>
          )}
          
          {saveStatus === 'error' && (
            <Alert variant="danger">
              Please fix the errors before saving.
            </Alert>
          )}
          
          {saveStatus === 'reset' && (
            <Alert variant="info">
              Settings have been reset to default values.
            </Alert>
          )}
          
          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header className="d-flex align-items-center">
                  <Palette className="me-2" /> Appearance
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Theme</Form.Label>
                    <Form.Select 
                      name="theme" 
                      value={settings.theme} 
                      onChange={handleInputChange}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Font Size</Form.Label>
                    <Form.Select 
                      name="fontSize" 
                      value={settings.fontSize} 
                      onChange={handleInputChange}
                      isInvalid={!!errors.fontSize}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </Form.Select>
                    {errors.fontSize && (
                      <Form.Text className="text-danger">{errors.fontSize}</Form.Text>
                    )}
                  </Form.Group>
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Header className="d-flex align-items-center">
                  <Globe className="me-2" /> Language & Region
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Language</Form.Label>
                    <Form.Select 
                      name="language" 
                      value={settings.language} 
                      onChange={handleInputChange}
                      isInvalid={!!errors.language}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="bn">Bengali</option>
                    </Form.Select>
                    {errors.language && (
                      <Form.Text className="text-danger">{errors.language}</Form.Text>
                    )}
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header className="d-flex align-items-center">
                  <Bell className="me-2" /> Notifications
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="notifications-switch"
                      name="notifications"
                      label="Enable notifications"
                      checked={settings.notifications}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="email-notifications-switch"
                      name="emailNotifications"
                      label="Email notifications"
                      checked={settings.emailNotifications}
                      onChange={handleInputChange}
                      disabled={!settings.notifications}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="sound-effects-switch"
                      name="soundEffects"
                      label="Sound effects"
                      checked={settings.soundEffects}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Header className="d-flex align-items-center">
                  <Shield className="me-2" /> Privacy & Data
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Privacy Settings</Form.Label>
                    <Form.Select 
                      name="privacy" 
                      value={settings.privacy} 
                      onChange={handleInputChange}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="auto-save-switch"
                      name="autoSave"
                      label="Auto-save progress"
                      checked={settings.autoSave}
                      onChange={handleInputChange}
                    />
                    <Form.Text className="text-muted">
                      Automatically save your work as you go
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <div className="d-flex gap-2 justify-content-end mt-4">
            <Button variant="outline-secondary" onClick={resetSettings}>
              Reset to Defaults
            </Button>
            <Button variant="primary" onClick={saveSettings}>
              <Save className="me-1" /> Save Settings
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
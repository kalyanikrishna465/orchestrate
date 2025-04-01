import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import homeImage from "../components/home.jpg";

// New imports for our bonus features
import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Home = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // States for our bonus features
  const [eyeGazeStatus, setEyeGazeStatus] = useState("Not tracking");
  const [isAttentive, setIsAttentive] = useState(true);
  const [attentionScore, setAttentionScore] = useState(100);
  const [aiAssistantMessage, setAiAssistantMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "Team", message: "Welcome to today's meeting!", sentiment: "positive" },
    { sender: "Alice", message: "I've finished the design mockups", sentiment: "neutral" },
    { sender: "Bob", message: "Great job everyone!", sentiment: "positive" }
  ]);
  const [teamSentiment, setTeamSentiment] = useState("Positive");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showEyeTracker, setShowEyeTracker] = useState(false);

  // Voice command recognition
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  
  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        console.log("Face detection models loaded successfully");
      } catch (error) {
        console.error("Error loading face detection models:", error);
      }
    };
    
    loadModels();
  }, []);

  // Process voice commands
  useEffect(() => {
    if (transcript) {
      if (transcript.toLowerCase().includes("navigate to projects")) {
        setAiAssistantMessage("Navigating to projects page...");
        setTimeout(() => navigate("/projects"), 2000);
      } else if (transcript.toLowerCase().includes("show eye tracking")) {
        setShowEyeTracker(true);
        setAiAssistantMessage("Eye tracking activated");
      } else if (transcript.toLowerCase().includes("hide eye tracking")) {
        setShowEyeTracker(false);
        setAiAssistantMessage("Eye tracking deactivated");
      } else if (transcript.toLowerCase().includes("show ai assistant")) {
        setShowAiPanel(true);
        setAiAssistantMessage("AI Assistant at your service");
      } else if (transcript.toLowerCase().includes("hide ai assistant")) {
        setShowAiPanel(false);
      }
    }
  }, [transcript, navigate]);

  // Simulated eye tracking function
  const startEyeTracking = () => {
    if (!showEyeTracker) {
      setShowEyeTracker(true);
    }
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setEyeGazeStatus("Tracking active");
            
            // Simulate attention fluctuations
            const attentionInterval = setInterval(() => {
              const randomChange = Math.floor(Math.random() * 10) - 5;
              setAttentionScore(prevScore => {
                const newScore = Math.max(0, Math.min(100, prevScore + randomChange));
                setIsAttentive(newScore > 70);
                return newScore;
              });
            }, 3000);
            
            return () => clearInterval(attentionInterval);
          }
        })
        .catch(error => {
          console.error("Error accessing camera:", error);
          setEyeGazeStatus("Camera access denied");
        });
    } else {
      setEyeGazeStatus("Camera not supported");
    }
  };

  // Simulate AI assistant messages
  useEffect(() => {
    const aiMessageInterval = setInterval(() => {
      const aiMessages = [
        "Remember to update your project timeline",
        "Three team members have pending tasks",
        "Meeting with stakeholders tomorrow at 2 PM",
        "New feedback received on your latest submission",
        "Analysis suggests project is on track for completion"
      ];
      
      setAiAssistantMessage(aiMessages[Math.floor(Math.random() * aiMessages.length)]);
    }, 8000);
    
    return () => clearInterval(aiMessageInterval);
  }, []);

  // Add a new chat message with sentiment analysis
  const addChatMessage = (message, sender = "You") => {
    // Simple sentiment analysis
    let sentiment = "neutral";
    const positiveWords = ["great", "good", "excellent", "happy", "love", "amazing"];
    const negativeWords = ["bad", "poor", "terrible", "hate", "awful", "disappointing"];
    
    const messageLower = message.toLowerCase();
    
    if (positiveWords.some(word => messageLower.includes(word))) {
      sentiment = "positive";
    } else if (negativeWords.some(word => messageLower.includes(word))) {
      sentiment = "negative";
    }
    
    const newMessage = { sender, message, sentiment };
    setChatMessages(prev => [...prev, newMessage]);
    
    // Update team sentiment
    const sentiments = [...chatMessages, newMessage].map(msg => msg.sentiment);
    const positiveCount = sentiments.filter(s => s === "positive").length;
    const negativeCount = sentiments.filter(s => s === "negative").length;
    
    if (positiveCount > negativeCount * 2) {
      setTeamSentiment("Very Positive");
    } else if (positiveCount > negativeCount) {
      setTeamSentiment("Positive");
    } else if (negativeCount > positiveCount) {
      setTeamSentiment("Negative");
    } else {
      setTeamSentiment("Neutral");
    }
  };

  return (
    <>
      <Header />
      <div style={styles.heroSection}>
        <div style={styles.overlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Welcome to Orchestrate</h1>
          <p style={styles.subtitle}>
            Streamline your project planning and execution with our all-in-one platform.
          </p>
          <button style={styles.startButton} onClick={() => navigate("/projects")}>
            Get Started
          </button>
        </div>
      </div>

      <div style={styles.container}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why Choose Orchestrate?</h2>
          <p style={styles.sectionText}>
            Orchestrate is designed to help teams and individuals manage projects efficiently,
            collaborate seamlessly, and track progress effortlessly.
          </p>
        </section>

        <section style={styles.featuresSection}>
          <div style={styles.feature}>
            <h3>Plan with Precision</h3>
            <p>Create, assign, and manage tasks with an intuitive project dashboard.</p>
          </div>
          <div style={styles.feature}>
            <h3>Track Progress</h3>
            <p>Monitor project milestones, deadlines, and overall progress in real-time.</p>
          </div>
          <div style={styles.feature}>
            <h3>Collaborate Effectively</h3>
            <p>Enhance teamwork with built-in communication and file-sharing tools.</p>
          </div>
        </section>

        {/* New Interactive Prototype Features */}
        <section style={styles.advancedFeaturesSection}>
          <h2 style={styles.sectionTitle}>Advanced Collaboration Features</h2>
          
          {/* Voice Command Support */}
          <div style={styles.advancedFeature}>
            <h3>Voice Command Support</h3>
            <p>Navigate and control Orchestrate hands-free with voice commands</p>
            <div style={styles.voiceCommandArea}>
              <button 
                style={{...styles.featureButton, backgroundColor: listening ? '#B85042' : '#568265'}} 
                onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({ continuous: true })}
              >
                {listening ? 'Stop Listening' : 'Start Voice Commands'}
              </button>
              {browserSupportsSpeechRecognition ? (
                <p style={styles.transcriptText}>
                  {transcript ? `"${transcript}"` : 'Say a command like "Navigate to projects" or "Show AI assistant"'}
                </p>
              ) : (
                <p>Your browser doesn't support speech recognition.</p>
              )}
            </div>
          </div>
          
          {/* Eye-Gazing Tracker */}
          <div style={styles.advancedFeature}>
            <h3>Attention Tracking</h3>
            <p>Ensure meeting participants stay engaged with our eye-tracking technology</p>
            <button 
              style={styles.featureButton} 
              onClick={startEyeTracking}
            >
              {showEyeTracker ? 'Tracking Active' : 'Enable Attention Tracking'}
            </button>
            
            {showEyeTracker && (
              <div style={styles.eyeTrackingBox}>
                <div style={styles.videoContainer}>
                  <video ref={videoRef} autoPlay style={styles.videoFeed} />
                  <canvas ref={canvasRef} style={styles.canvas} />
                </div>
                <div style={styles.attentionMetrics}>
                  <p>Status: {eyeGazeStatus}</p>
                  <p>User is {isAttentive ? 'attentive' : 'distracted'}</p>
                  <div style={styles.attentionBar}>
                    <div 
                      style={{
                        ...styles.attentionBarFill, 
                        width: `${attentionScore}%`,
                        backgroundColor: attentionScore > 70 ? '#568265' : attentionScore > 40 ? '#FFA500' : '#B85042'
                      }} 
                    />
                  </div>
                  <p>Attention Score: {attentionScore}%</p>
                </div>
              </div>
            )}
          </div>
          
          {/* AI Assistant & Sentiment Analysis */}
          <div style={styles.advancedFeature}>
            <h3>AI-Powered Assistant & Team Sentiment</h3>
            <p>Get intelligent assistance and understand team morale in real-time</p>
            <button 
              style={styles.featureButton} 
              onClick={() => setShowAiPanel(!showAiPanel)}
            >
              {showAiPanel ? 'Hide AI Panel' : 'Show AI Panel'}
            </button>
            
            {showAiPanel && (
              <div style={styles.aiPanel}>
                <div style={styles.aiAssistant}>
                  <h4>AI Assistant</h4>
                  <div style={styles.aiMessageBox}>
                    <p>{aiAssistantMessage || "How can I help you today?"}</p>
                  </div>
                </div>
                
                <div style={styles.sentimentAnalysis}>
                  <h4>Team Chat & Sentiment</h4>
                  <div style={styles.sentimentIndicator}>
                    <p>Team Morale: <span style={{
                      color: teamSentiment.includes("Positive") ? '#568265' : 
                        teamSentiment === "Neutral" ? '#FFA500' : '#B85042'
                    }}>{teamSentiment}</span></p>
                  </div>
                  
                  <div style={styles.chatBox}>
                    {chatMessages.map((msg, index) => (
                      <div key={index} style={{
                        ...styles.chatMessage,
                        backgroundColor: msg.sender === "You" ? '#E8F5E9' : '#F5F5F5'
                      }}>
                        <strong>{msg.sender}: </strong>
                        <span>{msg.message}</span>
                        <span style={{
                          ...styles.sentimentMarker,
                          backgroundColor: msg.sentiment === "positive" ? '#568265' : 
                            msg.sentiment === "neutral" ? '#FFA500' : '#B85042'
                        }}></span>
                      </div>
                    ))}
                  </div>
                  
                  <div style={styles.chatInput}>
                    <input 
                      type="text" 
                      placeholder="Type your message..."
                      style={styles.textInput}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          addChatMessage(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button 
                      style={styles.sendButton}
                      onClick={(e) => {
                        const input = e.target.previousSibling;
                        if (input.value) {
                          addChatMessage(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section style={styles.ctaSection}>
          <h2>Ready to get started?</h2>
          <button style={styles.ctaButton} onClick={() => navigate("/projects")}>
            Start Your First Project
          </button>
        </section>
      </div>

      <Footer />
    </>
  );
};

// Original styles preserved
const styles = {
  heroSection: {
    position: "relative",
    height: "400px",
    backgroundImage: `url(${homeImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for better readability
  },
  heroContent: {
    textAlign: "center",
    color: "#fff",
    zIndex: 1,
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  startButton: {
    backgroundColor: "#568265",
    color: "#fff",
    padding: "15px 30px",
    border: "none",
    borderRadius: "5px",
    fontSize: "18px",
    cursor: "pointer",
  },
  container: {
    padding: "50px 20px",
    maxWidth: "1000px",
    margin: "auto",
    textAlign: "center",
  },
  section: {
    marginBottom: "50px",
  },
  sectionTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  sectionText: {
    fontSize: "16px",
    color: "#555",
  },
  featuresSection: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  feature: {
    flex: "1",
    minWidth: "250px",
    padding: "20px",
    backgroundColor: "#92C3A4",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    margin: "10px",
  },
  ctaSection: {
    marginTop: "50px",
    backgroundColor: "#568265",
    padding: "20px",
    borderRadius: "10px",
    color: "#fff",
    marginBottom: "50px",
  },
  ctaButton: {
    backgroundColor: "#B85042",
    color: "#fff",
    padding: "12px 25px",
    border: "none",
    borderRadius: "5px",
    fontSize: "18px",
    cursor: "pointer",
  },
  
  // New styles for interactive features
  advancedFeaturesSection: {
    marginTop: "30px",
    marginBottom: "30px",
  },
  advancedFeature: {
    border: "1px solid #E0E0E0",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#F9F9F9",
    textAlign: "left",
  },
  featureButton: {
    backgroundColor: "#568265",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  voiceCommandArea: {
    marginTop: "15px",
  },
  transcriptText: {
    fontStyle: "italic",
    margin: "10px 0",
  },
  eyeTrackingBox: {
    display: "flex",
    marginTop: "15px",
    flexWrap: "wrap",
  },
  videoContainer: {
    flex: "1",
    minWidth: "250px",
    position: "relative",
  },
  videoFeed: {
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  attentionMetrics: {
    flex: "1",
    minWidth: "250px",
    padding: "0 15px",
  },
  attentionBar: {
    width: "100%",
    height: "20px",
    backgroundColor: "#E0E0E0",
    borderRadius: "10px",
    overflow: "hidden",
    margin: "10px 0",
  },
  attentionBarFill: {
    height: "100%",
    transition: "width 0.5s ease, background-color 0.5s ease",
  },
  aiPanel: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
  },
  aiAssistant: {
    backgroundColor: "#E8F5E9",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  aiMessageBox: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  sentimentAnalysis: {
    backgroundColor: "#F5F5F5",
    padding: "15px",
    borderRadius: "10px",
  },
  sentimentIndicator: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    border: "1px solid #ccc",
  },
  chatBox: {
    height: "250px",
    overflowY: "auto",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    border: "1px solid #ccc",
  },
  chatMessage: {
    padding: "8px",
    borderRadius: "5px",
    marginBottom: "8px",
    position: "relative",
  },
  sentimentMarker: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  chatInput: {
    display: "flex",
  },
  textInput: {
    flex: "1",
    padding: "10px",
    borderRadius: "5px 0 0 5px",
    border: "1px solid #ccc",
    borderRight: "none",
  },
  sendButton: {
    backgroundColor: "#568265",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "0 5px 5px 0",
    cursor: "pointer",
  },
};

export default Home;
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  // Modern Physics-Based Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 80, damping: 20 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 25 }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 70, damping: 20 }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 70, damping: 20 }
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <img 
            src="/images/hero-bg-lens.jpg" 
            alt="Photography Lens" 
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container hero-content">
          <motion.div
            variants={fadeInUp} initial="hidden" animate="visible"
          >
            <p className="hero-tagline" style={{
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              marginTop: '-15px',
              marginBottom: '25px', 
              fontSize: '1.1rem', 
              fontWeight: '800', 
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            }}>Film & Photography Club</p>
            <h1 className="hero-title" style={{textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px'}}>
              CAPTURE. CREATE.<br/>
              <span style={{
                fontFamily: 'var(--font-display)', 
                fontStyle: 'italic', 
                fontWeight: '500', 
                textTransform: 'none', 
                color: '#e6c193', /* Brighter color for visibility */
                fontSize: '1.3em', /* Make Inspire larger */
                display: 'inline-block',
                marginTop: '10px',
                textShadow: '0 4px 15px rgba(0,0,0,0.5)' /* Add glow/shadow for contrast */
              }}>Inspire.</span>
            </h1>
            <p className="hero-tagline" style={{fontWeight: '500', letterSpacing: '1px', fontSize: '1.15rem', marginTop: '10px'}}>
              EXPLORE. OBSERVE. CAPTURE OUR CAMPUS BEAUTIFULLY.
            </p>
            <p className="hero-tagline" style={{marginTop: '-20px', fontSize: '1.05rem', opacity: '0.8'}}>
              See Different. Shoot Different. Tell Our Story.
            </p>
              <div className="hero-cta">
                {user ? (
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary">Go to Dashboard</Link>
                ) : (
                  <>
                    <Link to="/register" className="btn-primary">Register Now</Link>
                    <Link to="/login" className="btn-secondary">Login</Link>
                  </>
                )}
              </div>
          </motion.div>
        </div>

        {/* Modern Scroll Indicator */}
        <motion.div 
          className="mouse-indicator-container"
          initial={{ opacity: 0, x: "-50%", y: 20 }}
          animate={{ opacity: 1, x: "-50%", y: [0, 8, 0] }}
          transition={{ opacity: { duration: 1, delay: 1.2 }, y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          style={{ cursor: "pointer", paddingBottom: "20px" }}
        >
          <span style={{ 
            fontFamily: "system-ui, -apple-system, sans-serif", 
            fontSize: "0.85rem", 
            letterSpacing: "3px", 
            textTransform: "uppercase", 
            color: "rgba(255,255,255,0.8)",
            fontWeight: 400 
          }}>Scroll down to explore</span>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section container">
        <div className="about-grid">
          <motion.div 
            className="about-text"
            variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          >
            <h2>About the Event</h2>
            <p>
             Inspire is a photography contest designed for college students who have a passion for visual storytelling. Whether you capture the beauty of nature & greenery, reflections & perspectives, creative campus views, or everyday objects turned into extraordinary frames, this platform is yours.
            </p>
            <div className="process-box">
              <h3 className="process-heading">
                <span style={{color: 'var(--color-accent)'}}>⚡</span> Process
              </h3>
              <ul className="process-list">
                <li><span className="process-highlight">Contestants:</span> Must select one of the 4 official themes upon registration. Contestant can upload only one picture of their theme (Maximum 25 entries per theme!)</li>
                <li><span className="process-highlight">Viewers:</span> Can anonymously vote for their favorite pictures. You get one vote per theme and can vote across every theme.</li>
                <li><span className="process-highlight">The Best:</span> Submissions will be showcased and stand a chance to win prizes, certificates, and recognition!.</li>
                <li><span className="process-highlight">Registration:</span> The registration fee is just ₹49 only...</li>
              </ul>
            </div>
          </motion.div>
          <motion.div 
            className="about-image"
            variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          >
            <img 
              src="https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1000&auto=format&fit=crop" 
              alt="Camera in hands" 
            />
          </motion.div>
        </div>
      </section>

      {/* Rules Section */}
      <section id="rules" className="rules-section container" style={{ marginTop: '80px', marginBottom: '80px', padding: '60px 40px', background: 'var(--color-surface)', borderRadius: '24px', boxShadow: '0 15px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
          
          {/* Left Side: Heading */}
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(139, 115, 85, 0.1)', padding: '8px 16px', borderRadius: '20px', marginBottom: '20px' }}>
              <p style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', fontSize: '0.85rem', margin: 0 }}>03 / BEFORE YOU SHOOT</p>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', lineHeight: '1.1', fontWeight: '400', margin: 0, color: 'var(--color-text-primary)' }}>
              <span style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>Rules.</span>
            </h2>
            <p style={{ marginTop: '20px', fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Please read these guidelines carefully before submitting your photographs to ensure a fair and inspiring competition for everyone.
            </p>
          </motion.div>

          {/* Right Side: Rules List */}
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { num: '01', text: 'Every photograph must be taken within the college campus.' },
              { num: '02', text: 'Photographs should strictly adhere to the chosen theme, and no human faces should be visible in the frame.' },
              { num: '03', text: 'Any blurry, inappropriate, or irrelevant images will be disqualified and removed.' },
              { num: '04', text: 'Submission deadlines are strictly enforced and dates will not be extended.' },
              { num: '05', text: 'Maximum registrations are capped at 25 entries per theme category.' }
            ].map((rule, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                whileHover={{ x: 10, backgroundColor: 'rgba(0,0,0,0.02)' }}
                style={{ 
                  display: 'flex', 
                  gap: '30px', 
                  padding: '25px 20px', 
                  borderTop: idx === 0 ? 'none' : '1px solid var(--color-border)',
                  borderRadius: '12px',
                  transition: '0.3s'
                }}
              >
                <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '600' }}>{rule.num}</span>
                <p style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '1.1rem', lineHeight: '1.5', fontWeight: '500' }}>{rule.text}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Club Information Section */}
      <section id="club" className="club-section container" style={{ marginTop: "40px", marginBottom: "80px" }}>
        <motion.div 
          className="club-card"
          variants={scaleUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
          style={{ 
            background: 'var(--color-surface)', 
            borderRadius: '16px', 
            padding: '40px', 
            boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
          }}
        >
          {/* Club Info & Logo Row */}
          <div className="club-header-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div className="club-text">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--color-text-primary)', fontFamily: 'inherit' }}>Film & Photography Club</h2>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-accent)', marginBottom: '20px', fontWeight: '600' }}>Aditya University</h3>
              <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '15px' }}>Capture Moments. Create Stories.</p>
              
              <p style={{ marginBottom: '15px', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
                The Film & Photography Club of Aditya University is a creative platform for students passionate about visual storytelling.
              </p>
              <p style={{ marginBottom: '15px', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
                The club focuses on photography, filmmaking, editing, and cinematography through workshops, photo walks, and short film projects.
              </p>
              <p style={{ marginBottom: '25px', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
                It helps students enhance their creativity, technical skills, and storytelling abilities while providing opportunities to showcase their work in competitions and events.
              </p>

              <div className="club-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ background: 'rgba(139, 115, 85, 0.1)', color: 'var(--color-accent)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>Photography</span>
                <span style={{ background: 'rgba(139, 115, 85, 0.1)', color: 'var(--color-accent)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>Filmmaking</span>
                <span style={{ background: 'rgba(139, 115, 85, 0.1)', color: 'var(--color-accent)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>Editing</span>
                <span style={{ background: 'rgba(139, 115, 85, 0.1)', color: 'var(--color-accent)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>Cinematography</span>
              </div>
            </div>

            <div className="club-logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', padding: '20px' }}>
                <img 
                  src="/images/au_logo_new.png" 
                  alt="Aditya University" 
                  style={{ width: "170px", marginBottom: "30px", mixBlendMode: "multiply" }} 
                />
              <img 
                src="/images/club_logo.png" 
                alt="Film and Photography Club Logo" 
                style={{ width: '100%', maxWidth: '350px', borderRadius: '12px', mixBlendMode: 'multiply' }} 
              />
            </div>
          </div>


        </motion.div>
      </section>

      {/* Call To Action Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-container"
            variants={scaleUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="cta-title">Ready to tell your story? <br/><span className="cta-highlight">Join the club</span> and become a member.</h2>
            <p className="cta-subtitle">Registrations will be announced soon. Stay tuned!</p>
          </motion.div>
        </div>
      </section>

      <section id="team" className="club-section container" style={{ marginBottom: "80px" }}>
        <motion.div
          className="club-card"
          variants={scaleUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
          style={{ 
            background: 'var(--color-surface)', 
            borderRadius: '16px', 
            padding: '40px', 
            boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
          }}
        >


          {/* Poster & Leadership Row */}
          <div className="club-poster-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'center' }}>
            
            {/* Left: Poster */}
            <motion.div 
              variants={scaleUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <img 
                src="/images/club_poster.jpg" 
                alt="Club Poster" 
                style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }} 
              />
            </motion.div>

            {/* Right: Leadership Cards */}
            <motion.div className="leadership-section" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--color-text-primary)' }}>Film and Photography Club</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>Meet the team behind the lens making it all happen.</p>

              {/* Leader Card 1 */}
              <motion.div 
                whileHover={{ scale: 1.05, translateX: 10 }}
                variants={fadeInUp}
                style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f9f8f6 100%)', borderLeft: '4px solid var(--color-accent)', padding: '20px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'default' }}
              >
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(139, 115, 85, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', fontSize: '1.2rem', fontWeight: 'bold' }}>M</div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-text-primary)' }}>R.Phani Neelesh</h4>
                  <p style={{ margin: 0, color: 'var(--color-accent)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Manager</p>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>📞 8688508914</p>
                </div>
              </motion.div>

              {/* Leader Card 2 */}
              <motion.div 
                whileHover={{ scale: 1.05, translateX: 10 }}
                variants={fadeInUp}
                style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f9f8f6 100%)', borderLeft: '4px solid var(--color-accent)', padding: '20px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'default' }}
              >
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(139, 115, 85, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', fontSize: '1.2rem', fontWeight: 'bold' }}>AM</div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-text-primary)' }}>K.Satwika</h4>
                  <p style={{ margin: 0, color: 'var(--color-accent)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Asst Manager</p>
                </div>
              </motion.div>

              {/* Leader Card 3 */}
              <motion.div 
                whileHover={{ scale: 1.05, translateX: 10 }}
                variants={fadeInUp}
                style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f9f8f6 100%)', borderLeft: '4px solid var(--color-accent)', padding: '20px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'default' }}
              >
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(139, 115, 85, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', fontSize: '1.2rem', fontWeight: 'bold' }}>FC</div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-text-primary)' }}>N.Raveendra Reddy
                  </h4>
                  <p style={{ margin: 0, color: 'var(--color-accent)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Faculty Coordinator</p>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>📞 8374663389</p>
                </div>
              </motion.div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap', fontWeight: '600', color: 'var(--color-text-secondary)', letterSpacing: '1px', fontSize: '0.8rem' }}>
                <span>BE CREATIVE</span>
                <span>|</span>
                <span>BE INSPIRED</span>
                <span>|</span>
                <span>BE YOU</span>
              </div>
            </motion.div>
          </div>

        </motion.div>
      </section>
    </div>
  );
};

export default Home;








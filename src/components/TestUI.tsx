// Simple test component to verify deployment
const TestUI = () => {
  return (
    <div style={{
      backgroundColor: '#171f14',
      color: '#8cd279',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      🎸 TeleTuner - New UI Test 🎸
      <div style={{
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#8cd279',
        color: '#171f14',
        borderRadius: '10px'
      }}>
        Modern UI Loaded Successfully!
      </div>
    </div>
  );
};

export default TestUI;
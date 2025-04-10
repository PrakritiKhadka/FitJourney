export default TokenParser = async (token) => {
    try {
        if (!token) {
          return res.status(400).json({
            message: 'No token provided',
          });
        }

          const verifiedToken = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          
          return verifiedToken.getPayload();
          
      } catch (err) {
        console.error('Google auth error:', err);
        res.status(500).json({ 
          message: 'Authentication failed',
          error: process.env.NODE_ENV === 'development' ? err.message : null
        });
      }
    }
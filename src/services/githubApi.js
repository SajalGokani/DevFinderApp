export const verifyGitHubUser = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    // If the server returns a 200 OK status, the username is valid and exists
    if (response.status === 200) {
      // Parse the raw response data into a usable JavaScript object
      const data = await response.json();
      return { success: true, data };
    }
    
    // If the status is anything else (like a 404 Not Found), return a failure flag
    return { success: false };
    
  } catch (error) {
    // If a network connection error or crash occurs, fail safely and return a failure flag
    return { success: false };
  }
};
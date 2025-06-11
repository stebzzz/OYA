const fs = require('fs').promises;
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const basePath = '/opt/build/repo/src/components/Auth';
    const files = await fs.readdir(basePath);
    
    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(basePath, file);
        const stats = await fs.stat(filePath);
        return {
          name: file,
          isDirectory: stats.isDirectory(),
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'File structure information',
        files: fileDetails
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error reading file structure',
        error: error.message
      })
    };
  }
} 
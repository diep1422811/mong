import React, { useState } from "react";
import axios from "axios";
import Banner from "./Banner.jsx";
import './Settings.css';

const Settings = () => {
  const [storyId, setStoryId] = useState(1);
  const [chapterId, setChapterId] = useState(1);

  // Function to download any generic data as a JSON file
  const downloadData = async (endpoint, filename) => {
    try {
      const response = await axios.get(endpoint); // Fetch data from the API
      const data = response.data;

      // Convert data to JSON string and create a Blob
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });

      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (error) {
      console.error(`Failed to download ${filename}:`, error);
      alert(`Failed to download ${filename}. Please try again.`);
    }
  };

  // Function to download all stories data, including chapters, comments, and reports
  const downloadStoriesData = async () => {
    try {
      // Fetch all stories data
      const storiesResponse = await axios.get("http://3.26.145.187:8000/api/stories");
      const storiesData = storiesResponse.data.items; // Assuming the API returns a list of stories

      // For each story, fetch its chapters, comments, and reports
      const storiesWithDetails = await Promise.all(
        storiesData.map(async (story) => {
          // Fetch chapters for the story
          const chaptersResponse = await axios.get(`http://3.26.145.187:8000/api/stories/${story.id}/chapters`);
          const chaptersData = chaptersResponse.data.items;

          // For each chapter, fetch the comments
          const chaptersWithComments = await Promise.all(
            chaptersData.map(async (chapter) => {
              const commentsResponse = await axios.get(
                `http://3.26.145.187:8000/api/stories/${story.id}/chapters/${chapter.id}/comments`
              );
              const commentsData = commentsResponse.data.items;

              return {
                ...chapter,
                comments: commentsData, // Add the comments to the chapter
              };
            })
          );

          // Fetch reports for the story
          const reportsResponse = await axios.get(`http://3.26.145.187:8000/api/reports/stories/${story.id}`);
          const reportsData = reportsResponse.data.items;

          return {
            ...story,
            chapters: chaptersWithComments,
            reports: reportsData,
          };
        })
      );

      // Combine all stories data with their details
      const combinedData = {
        stories: storiesWithDetails,
      };

      // Convert combined data to JSON string and create a Blob
      const jsonData = JSON.stringify(combinedData, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });

      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `all_stories_data.json`;
      link.click();
    } catch (error) {
      console.error("Error downloading stories data:", error);
      alert("Error downloading stories data. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Settings</h1>
      <div className="settings-content">
        <div className="banner-column">
          {/* <h2>System Banner</h2>
          <Banner /> */}
        </div>

        <div className="backup-column">
          <h2>Data Backup</h2>
          <p>Click the buttons below to download system data as JSON files.</p>

          {/* Download Users Data */}
          <button
            className="backup-btn"
            onClick={() => downloadData("http://3.26.145.187:8000/api/superadmin/users", "users_backup.json")}
          >
            Download Users Data
          </button>

          {/* Download All Stories Data */}
          <button
            className="backup-btn"
            onClick={downloadStoriesData}
          >
            Download All Stories Data (Chapters, Comments, Reports)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

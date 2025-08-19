import React from "react";

export default function HomePage() {
  return (
    <>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // center horizontally
          boxSizing: "border-box",
        }}
      >
       <h1> Welcome to home page </h1>
      </div>
    </>
  );
}

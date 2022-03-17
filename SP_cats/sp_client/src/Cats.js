import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Grow,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material/";
import { AppContext } from "./context";

function Cats() {
  const { user } = useContext(AppContext);
  const [cats, setCats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCats().then((cats) => {
      setCats(cats);
    });
    return () => {
      setCats({});
    };
  }, []);

  const getCats = async () => {
    const res = await fetch("http://localhost:5000/cats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        "Content-Type": "application/json",
      },
    });

    // Parse response and display alert accordingly
    let cats = await res.json();
    console.log("Cats: ", JSON.stringify(cats, 0, 2));
    return cats;
  };

  return (
    <div>
      {user && cats && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h2"> ✨ Cats ✨ </Typography>
          <ImageList sx={{ width: 1, height: 0.9 }} variant="woven" cols={3}>
            {cats.map((cat, idx) => (
              <Grow
                in={true}
                style={{ transformOrigin: "0 0 0" }}
                {...(true ? { timeout: 1500 } : {})}
                key={`Grow:${cat}Index${idx}`}
              >
                <ImageListItem key={`ImageListItem:${cat}Index${idx}`}>
                  <img
                    src={`${cat}?w=161&fit=crop&auto=format`}
                    srcSet={`${cat}?w=161&fit=crop&auto=format&dpr=2 2x`}
                    alt={cat}
                    loading="lazy"
                  />
                </ImageListItem>
              </Grow>
            ))}
          </ImageList>
        </Box>
      )}
    </div>
  );
}

export default Cats;

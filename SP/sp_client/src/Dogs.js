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

function Dogs() {
  const { user } = useContext(AppContext);
  const [dogs, setDogs] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDogs().then((dogs) => {
      setDogs(dogs);
    });
    return () => {
      setDogs({});
    };
  }, []);

  const getDogs = async () => {
    const res = await fetch("http://localhost:4000/dogs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        "Content-Type": "application/json",
      },
    });

    // Parse response and display alert accordingly
    let dogs = await res.json();
    console.log("Dogs: ", JSON.stringify(dogs, 0, 2));
    return dogs;
  };

  return (
    <div>
      {user && dogs && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h2"> ✨ Dogs ✨ </Typography>
          <ImageList sx={{ width: 1, height: 0.9 }} variant="woven" cols={3}>
            {dogs.map((dog, idx) => (
              <Grow
                in={true}
                style={{ transformOrigin: "0 0 0" }}
                {...(true ? { timeout: 1500 } : {})}
                key={`Grow:${dog}Index${idx}`}
              >
                <ImageListItem key={`ImageListItem:${dog}Index${idx}`}>
                  <img
                    src={`${dog}?w=161&fit=crop&auto=format`}
                    srcSet={`${dog}?w=161&fit=crop&auto=format&dpr=2 2x`}
                    alt={dog}
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

export default Dogs;

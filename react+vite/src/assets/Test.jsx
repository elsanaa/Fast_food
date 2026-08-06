import React, { useEffect, useReducer } from "react";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const initialState = {
    data: [],
    isLoading: false,
    isError: false,
};

const storiesReducer = (state, action) => {
    switch (action.type) {
        case "SET_FETCH_INIT":
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case "SET_FETCH_FAILED":
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case "SET_STORIES":
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                isError: false,
            };
        default:
            return state;
    }
};

function Test() {
    const [state, dispatch] = useReducer(storiesReducer, initialState);
    const { data: stories, isLoading, isError } = state;

    useEffect(() => {

        // dispatch({ type: "SET_FETCH_INIT" });

        fetch(`${API_ENDPOINT}react`)
            .then((response) => response.json())
    
        .then((result) => {
            dispatch({
                type: "SET_STORIES",
                payload: result.hits || [],
            });
        })
        .catch((err) => {
            console.error("Fetch error:", err);
            dispatch({ type: "SET_FETCH_FAILED" });
        });
},[])

    return (
        <div>
            <h2>Hacker News — React stories</h2>

            {isError && <p style={{ color: "red" }}>Something went wrong...</p>}

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {stories.length === 0 ? (
                        <li>No stories available.</li>
                    ) : (
                        stories.map((story) => (
                            <li key={story.objectID}>
                               {story.title}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

export default Test;
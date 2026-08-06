import React, { useState, useEffect } from "react"

let SearchL = () => {
    let [SearchTerm, setSearchTerm] = useState()
    let [stories, SetStories] = useState(intialStories)
    useEffect(() => {
        localStorage.setItem('search', SearchTerm);

    }, [SearchTerm])
    let intialStories = [
        {
            title: "React",
            url: "https://reactjs.org/",
            author:"Jordan Walke",
            num_comments: 3,
            points: 4,
            obJectId: 0

        },
        {
            title: "Redux",
            url: "https://reactjs.org/",
            author:"Dan Abramov, Adrw Clark",
            num_comments: 2,
            points: 5,
            obJectId: 1
        }
    ]
    let handleRemoveStory = (item) => {
        let newStories = stories.filter(
            (story) => item.obJectId != story.obJectId
        );
        SetStories(newStories)
    }
    let handleSearch = (event) => {
        setSearchTerm(event.target.value);


    }
    let searchedStories;
    return (
        <div>
        </div>
    )
}
export default SearchL
import axios from "axios"
import * as $ from 'jquery';

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TV_MAZE_API = 'http://api.tvmaze.com'

const DEFAULT_IMG = `https://tinyurl.com/tv-missing`;

interface Show {
    id: number,
    name: string,
    summary: string,
    image: string
}
/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term: string): Promise<Show[]> {
    // ADD: Remove placeholder & make request to TVMaze search shows API.

    const res = await axios.get(`${TV_MAZE_API}/search/shows?q=${term}`)
    const shows: [] = res.data;

    const showsInfo: Show[] = shows.map((show: Record<string, any>) => {
        const  {id, name, summary} = show.show
        const image = show.show.image && show.show.image.medium || DEFAULT_IMG ;

        return { id, name, summary, image }
    })

    return showsInfo
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
    console.log("Populate Shows: shows", shows)
    $showsList.empty();

    for (let show of shows) {
        const $show = $(
            `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt=${show.name}"
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

        $showsList.append($show);
    }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay(): Promise<void> {
    const term: string = $("#searchForm-term").val() as string;
    const shows = await getShowsByTerm(term);

    $episodesArea.hide();
    populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
    evt.preventDefault();
    await searchForShowAndDisplay();
    console.log("Search handler");
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
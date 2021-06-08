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
    image: {medium: string}
}

interface Episode {
    id: number,
    name: string,
    season: string,
    number: string
}

// interface SubmitEvent extends Event {
//   submitter: HTMLElement; 
// }

// interface HTMLFormElement {
//   onsubmit: (this: GlobalEventHandlers, ev: SubmitEvent) => any | null;
// }

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term: string): Promise<Show[]> {
    // ADD: Remove placeholder & make request to TVMaze search shows API.

    const res = await axios.get(`${TV_MAZE_API}/search/shows?q=${term}`)

    const showsInfo: Show[] = res.data.map((result: {show: Show}) => {
        const show = result.show;
        const  {id, name, summary} = show;
        const image = show.image?.medium || DEFAULT_IMG ;

        return { id, name, summary, image }
    })

    return showsInfo
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: Show[]): void {
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

$searchForm.on("submit", async function (evt: JQuery.SubmitEvent) {
    evt.preventDefault();
    await searchForShowAndDisplay();
    console.log("Search handler");
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id: number): Promise<Episode[]> {
  const res = await axios.get(`${TV_MAZE_API}/shows/${id}/episodes`)
  const episodes: [] = res.data; 

  const episodesInfo: Episode[] = episodes.map(episode => {
    const {id, name, season, number} = episode;
    return {id, name, season, number}
  });

  return episodesInfo;
 }

/** Given an array of episodesInfo, populates that into the episodeList
 * in the DOM.
 */
function populateEpisodes(episodesInfo: Episode[]): void { 
  $("#episodesList").empty();
  for (let episode of episodesInfo) {
    let $episode = $(`<li> ${episode.name} (season ${episode.season}, number ${episode.number})</li>`);
    $("#episodesList").append($episode);
  }
  $episodesArea.show();
}

/** gets list of episodes for the selected show and updates the DOM */
async function buttonHandler (evt: JQuery.ClickEvent) {
  console.log(`buttonHandler triggered`)
  let id: number = $(evt.target).closest(".Show").data("show-id");
  let listOfEpisodes: Episode[] = await getEpisodesOfShow(id);
  populateEpisodes(listOfEpisodes);
}

$showsList.on("click", ".Show-getEpisodes", buttonHandler)

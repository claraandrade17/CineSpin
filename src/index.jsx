document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "f97aa643aaeftd0ccfa0b4477fof85ca"; 
    const moodSelect = document.getElementById("mood-select");
    const getMovieBtn = document.getElementById("get-movie");
    const movieContainer = document.getElementById("movie-container");


    movieContainer.classList.add("hidden");

    getMovieBtn.addEventListener("click", async () => {
        movieContainer.classList.add("hidden"); 

        const mood = moodSelect.value;
        

        movieContainer.classList.remove("hidden");
        movieContainer.innerHTML = `
            <div class="loading-spinner"></div>
            <p class="loading-text">Finding the perfect movie...</p>
        `;

        const prompt = `Recommend a movie for someone in the mood for ${mood} movies. 
        Format your response **exactly** like this:
        Title: "Movie Name"
        Year: (YYYY)
        Description: A **brief but complete** summary (maximum 3 full sentences).`;

        const apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&key=${API_KEY}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.answer) {
                let movieText = data.answer.trim();

   
                const titleMatch = movieText.match(/Title:\s*["“]([^"”]+)["”]/);
                const yearMatch = movieText.match(/Year:\s*\(?(\d{4})\)?/);
                const descriptionMatch = movieText.match(/Description:\s*(.+)/);

                let movieTitle = titleMatch ? titleMatch[1] : "Unknown Movie";
                let movieYearText = yearMatch ? `(${yearMatch[1]})` : "";
                let movieDescriptionText = descriptionMatch ? descriptionMatch[1] : "No description available.";

               
                const maxLength = 200; 
                if (movieDescriptionText.length > maxLength) {
                    let trimmedText = movieDescriptionText.substring(0, maxLength);
                    const lastPeriod = trimmedText.lastIndexOf(".");
                    if (lastPeriod !== -1) {
                        movieDescriptionText = trimmedText.substring(0, lastPeriod + 1); 
                    } else {
                        movieDescriptionText = trimmedText; 
                    }
                }


                setTimeout(() => {
                    movieContainer.innerHTML = `
                        <h3 class="movie-title">${movieTitle} <span class="movie-year">${movieYearText}</span></h3>
                        <p class="movie-description">${movieDescriptionText}</p>
                    `;
                }, 1500);
            } else {
                movieContainer.innerHTML = `<p class='error'>Oops! Couldn't fetch a recommendation. Try again.</p>`;
            }
        } catch (error) {
            console.error("Error fetching movie recommendation:", error);
            movieContainer.innerHTML = `<p class='error'>Error: Unable to fetch a movie recommendation.</p>`;
        }
    });
});

document.getElementById("ai-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const API_KEY = "f97aa643aaeftd0ccfa0b4477fof85ca";
    const userInput = document.getElementById("user-input").value;
    const prompt = `Give me a movie recommendation based on: "${userInput}"`;
    const movieContainer = document.getElementById("movie-container");

  
    movieContainer.innerHTML = `
        <div class="loading-spinner"></div>
        <p class="loading-text">Finding the perfect movie...</p>
    `;
    movieContainer.classList.remove("hidden");

    try {
        
        const response = await fetch(`https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&key=${API_KEY}`);
        const data = await response.json();

        console.log("API Response:", data); 

        if (data && data.answer) {
            let aiText = data.answer;

            
            aiText = aiText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

            
            const titleMatch = aiText.match(/<strong>(.*?)<\/strong>/); 
            const yearMatch = aiText.match(/\((\d{4})\)/);

            const title = titleMatch ? titleMatch[1] : "Unknown Movie";
            const year = yearMatch ? yearMatch[1] : "";

            
            aiText = aiText.replace(/\bI recommend ,\s?/i, "I recommend ").trim();

            let sentences = aiText.split(". ");
            let shortDescription = sentences.slice(0, 3).join(". ");

            
            if (!shortDescription.endsWith(".")) {
                shortDescription += ".";
            }

            
            movieContainer.innerHTML = `
                <h2 class="movie-title">${title}</h2>
                <p class="movie-year">${year ? `(${year})` : ""}</p>
                <p class="movie-description">${shortDescription}</p>
            `;
            movieContainer.classList.add("show");
        } else {
            movieContainer.innerHTML = `<p class="error">Sorry, I couldn't extract a valid movie recommendation.</p>`;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        movieContainer.innerHTML = `<p class="error">Something went wrong. Please try again.</p>`;
    }
});

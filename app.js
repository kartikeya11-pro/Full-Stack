// Get references to the form and the submit button
const eventForm = document.getElementById('eventForm');
const submitBtn = document.getElementById('submitBtn');

eventForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevents the page from reloading immediately

    // 1. Visual Feedback: Disable button to prevent double-clicks
    submitBtn.innerText = "Processing Registration...";
    submitBtn.disabled = true;

    // 2. Collect data from the form inputs
    // These IDs must match the 'id' attributes in your index.html
    const registrationData = {
        studentName: document.getElementById('studentName').value,
        studentId: document.getElementById('studentId').value,
        email: document.getElementById('studentEmail').value,
        selectedEvent: document.getElementById('eventSelect').value,
        submittedAt: new Date().toLocaleString() // Adds a readable timestamp
    };

    try {
        // 3. Send data to Firebase Firestore
        // We use 'window.db' etc. because they were defined in the index.html module script
        const docRef = await window.addDoc(window.collection(window.db, "vtu_event_registrations"), registrationData);
        
        console.log("Success! Document ID: ", docRef.id);

        // 4. Prepare data for the Invoice/Success page
        // We pass the data through the URL so success.html can read it
        const queryParams = new URLSearchParams({
            name: registrationData.studentName,
            id: registrationData.studentId,
            email: registrationData.email,
            event: registrationData.selectedEvent,
            ref: docRef.id // This is the unique Firebase ID for the receipt
        }).toString();

        // 5. Redirect to the Success/Invoice page
        window.location.href = "success.html?" + queryParams;

    } catch (error) {
        // If there is an error (like permission denied or network issues)
        console.error("Detailed Firebase Error: ", error);
        alert("Submission failed. Please check your Firebase Rules or Internet connection. Error: " + error.message);
        
        // Reset the button so the user can try again
        submitBtn.innerText = "Submit Registration";
        submitBtn.disabled = false;
    }
});
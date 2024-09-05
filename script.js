async function showTodayTimetable(id, day = new Date().toLocaleDateString('pl-PL', { weekday: 'short' }).toLowerCase()) {
	var notToday = false;
	if (day === 'sob.' || day === 'niedz.') {
	  day = 'pon.';
	  notToday = true;
	}
  
	try {
	  const lessonsResponse = await fetch('../lessons.json');
	  const lessonsData = await lessonsResponse.json();
  
	  const timetableResponse = await fetch('../timetable.json');
	  const timetableData = await timetableResponse.json();
	  
	  const timetableForSelDay = timetableData[id][day];
	  if (!timetableForSelDay) {
		console.log(`No timetable data found for selected day. ${day}`);
		return;
	  }
  
	  const timetableElement = document.querySelector('.timetable'); // Get the table element
  
	  // Clear existing content (optional)
	  timetableElement.innerHTML = '';
  
	  if (notToday) {
		console.log(`\nTimetable for next Monday (${timetableForSelDay.name}):\n`);
	  } else {
		console.log(`\nToday's timetable (${timetableForSelDay.name}):\n`);
	  }
  
	  const lessons = timetableForSelDay.lessons;
  
	  // Create table header row
	 
	  for (const lessonSlot in lessons) {
		const lessonId = lessons[lessonSlot].id_lesson;
		const lessonClass = lessons[lessonSlot].class;
		const lessonDetails = lessonsData.lessons[id][lessonId];
		console.log(`${lessonSlot}: ${lessonDetails.name} (${lessonDetails.teacher})`);
		console.log(`Class: ${lessonClass}`);
  
		// Create a new table row for each lesson
		const lessonRow = document.createElement('tr');
		const lessonSlotCell = document.createElement('td');
		lessonSlotCell.id = 'lesson_slot';
		lessonSlotCell.textContent = lessonSlot;
		lessonRow.appendChild(lessonSlotCell);
  
		// Get hour data from hours.json
		const hoursResponse = await fetch('../hours.json');
		const hoursData = await hoursResponse.json();
		const hourData = hoursData.hours[id][lessonSlot];
  
		// Add hour cell
		const hourCell = document.createElement('td');
		hourCell.id = 'hour';
		if (hourData) {
		  hourCell.innerHTML = `${hourData.start} <br> ${hourData.end}`;
		} else {
		  hourCell.textContent = '';
		}
		lessonRow.appendChild(hourCell);
  
		if (id == "d" && lessonDetails) {
		  lessonRow.appendChild(document.createElement('td')).innerHTML = `${lessonDetails.name} <br><p id="classroom">${lessonClass}</p><p id="teacher">&nbsp&nbsp&nbsp${lessonDetails.teacher}</p>`;
		} else if (lessonDetails) {
		  lessonRow.appendChild(document.createElement('td')).innerHTML = `${lessonDetails.name} <br><p id="classroom">${lessonClass}</p>`;
		} else {
		  lessonRow.appendChild(document.createElement('td')).textContent = 'Okienko';
		}
  
		timetableElement.appendChild(lessonRow); // Add lesson row to table
	  }
	} catch (error) {
	  console.error('Error fetching timetable data:', error);
	}
  }

  function getPreviousDay(day) {
	const daysOfSchoolWeek = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.'];

	const dayIndex = daysOfSchoolWeek.indexOf(day);
	const previousDayIndex = (dayIndex - 1 + daysOfSchoolWeek.length) % daysOfSchoolWeek.length;
	const previousDay = daysOfSchoolWeek[previousDayIndex];
	
	window.selectedDay = previousDay;
	return previousDay;
  }

  function getNextDay(day) {
	const daysOfSchoolWeek = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.'];

	const dayIndex = daysOfSchoolWeek.indexOf(day);
	const nextDayIndex = (dayIndex + 1) % daysOfSchoolWeek.length;
	const nextDay = daysOfSchoolWeek[nextDayIndex];
	
	window.selectedDay = nextDay;
	return nextDay;
  }
  
  function updateTodayDay() {
	document.getElementById("today-day").innerHTML = window.selectedDay;
  }
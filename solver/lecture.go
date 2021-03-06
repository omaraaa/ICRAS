package main

type course struct {
	jsonobj     map[string]interface{}
	name        string
	constraints *constraints
}

type lecture struct {
	coursejsonobj map[string]interface{}
	course        *course
	jsonobj       map[string]interface{}
	constraints   *constraints

	assignedInstructor   *instructor
	instructorCandidates []*instructor
	vistedInstructors    map[*instructor]bool

	assignedRoom   *room
	roomCandidates []*room
	vistedRooms    map[*room]bool

	assignedTimeslot *timeslot
	timeslots        []*timeslot
	vistedTimeslots  map[*timeslot]bool

	resolved  bool
	resolving bool
}

func (lecture *lecture) init(coursejsonobj, jsonobj map[string]interface{}) {
	lecture.jsonobj = jsonobj
	lecture.coursejsonobj = coursejsonobj
	lecture.vistedTimeslots = map[*timeslot]bool{}
	lecture.vistedInstructors = map[*instructor]bool{}
	lecture.vistedRooms = map[*room]bool{}
}

func (course *course) getJSONOBJ() map[string]interface{} {
	return course.jsonobj
}

func (lecture *lecture) getJSONOBJ() map[string]interface{} {
	return lecture.jsonobj
}

func (lecture *lecture) setTimeslot(state *state) bool {
	if lecture.assignedTimeslot != nil {
		lecture.unassignTimeslot()
	}
	for _, timeslot := range lecture.timeslots {
		if !lecture.vistedTimeslots[timeslot] {
			lecture.assignTimeslot(timeslot)
			lecture.vistedTimeslots[timeslot] = true
			return true
		}
	}
	return false
}

func (lecture *lecture) setRoom(state *state) bool {
	if lecture.assignedRoom != nil {
		lecture.unassignRoom()
	}
	for _, room := range lecture.roomCandidates {
		if !lecture.vistedRooms[room] && room.validLecture(lecture) {
			lecture.assignRoom(room)
			lecture.vistedRooms[room] = true
			return true
		}
	}
	return false
}

func (lecture *lecture) setInstructor(state *state) bool {
	if lecture.assignedInstructor != nil {
		lecture.unassignInstructor()
	}
	for _, instructor := range lecture.instructorCandidates {
		if !lecture.vistedInstructors[instructor] && instructor.validLecture(lecture) {
			lecture.assignInstructor(instructor)
			lecture.vistedInstructors[instructor] = true
			return true
		}
	}
	return false
}

func (lecture *lecture) assignInstructor(instructor *instructor) {
	lecture.assignedInstructor = instructor
	instructor.assignLecture(lecture)
}

func (lecture *lecture) assignRoom(room *room) {
	lecture.assignedRoom = room
	room.assignLecture(lecture)
}

func (lecture *lecture) assignTimeslot(timeslot *timeslot) {
	lecture.assignedTimeslot = timeslot
	timeslot.assignLecture(lecture)
}

func (lecture *lecture) unassignInstructor() {
	lecture.assignedInstructor.unassignLecture(lecture)
	lecture.assignedInstructor = nil
}

func (lecture *lecture) unassignRoom() {
	lecture.assignedRoom.unassignLecture(lecture)
	lecture.assignedRoom = nil
}

func (lecture *lecture) unassignTimeslot() {
	lecture.assignedTimeslot.unassignLecture(lecture)
	lecture.assignedTimeslot = nil
}

func (lecture *lecture) resetRooms() {
	if lecture.assignedRoom != nil {
		lecture.unassignRoom()
	}

	lecture.vistedRooms = map[*room]bool{}
}

func (lecture *lecture) resetInstructors() {
	if lecture.assignedInstructor != nil {
		lecture.unassignInstructor()
	}
	lecture.vistedInstructors = map[*instructor]bool{}
}

func (lecture *lecture) resetTimeslots() {
	if lecture.assignedTimeslot != nil {
		lecture.unassignTimeslot()
	}
	lecture.vistedTimeslots = map[*timeslot]bool{}
}

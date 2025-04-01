import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Chart } from "react-google-charts";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [showTasks, setShowTasks] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", startDate: "", endDate: "", priority: "Medium", dependencies: "" });
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);

  // Dummy data for resources and collaborators
  const [resources] = useState([
    { id: 1, name: "Resource 1", type: "Software" },
    { id: 2, name: "Resource 2", type: "Hardware" },
  ]);
  const [collaborators] = useState([
    { id: 1, name: "John Doe", role: "Developer" },
    { id: 2, name: "Jane Smith", role: "Designer" },
  ]);

  // Sample notification data
  useEffect(() => {
    setNotifications([
      { id: 1, type: "Mention", content: "John mentioned you in a comment", date: "2025-03-25" },
      { id: 2, type: "Meeting", content: "Team standup at 10:00 AM", date: "2025-03-29" },
      { id: 3, type: "Deadline", content: "UI Design completion due tomorrow", date: "2025-03-30" },
      { id: 4, type: "Update", content: "Project scope was updated", date: "2025-03-28" },
      { id: 5, type: "Mention", content: "Jane mentioned you in a document", date: "2025-03-27" },
      { id: 6, type: "Meeting", content: "Client review meeting at 2:00 PM", date: "2025-03-31" },
      { id: 7, type: "Deadline", content: "Backend integration deadline approaching", date: "2025-04-05" },
      { id: 8, type: "Update", content: "New resource added to project", date: "2025-03-26" },
    ]);
  }, []);

  const fetchProjectDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/projects/${id}`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError(error.message);
    }
  }, [id]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(error.message);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  useEffect(() => {
    if (showTasks || showProgress || showResources || showCollaborators || showDashboard) {
      fetchTasks();
    }
  }, [showTasks, showProgress, showResources, showCollaborators, showDashboard, fetchTasks]);

  const addTask = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, projectId: id }),
      });

      if (!response.ok) throw new Error("Failed to add task");

      const addedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, addedTask]);
      setNewTask({ name: "", startDate: "", endDate: "", priority: "Medium", dependencies: "" });
    } catch (error) {
      console.error("Error adding task:", error);
      setError(error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError(error.message);
    }
  };

  const completeTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (!response.ok) throw new Error("Failed to complete task");
      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === updatedTask._id ? { ...task, status: updatedTask.status } : task))
      );
    } catch (error) {
      console.error("Error completing task:", error);
      setError(error.message);
    }
  };

  const deleteProject = async () => {
    try {
      const response = await fetch(`http://localhost:5000/projects/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete project");
      navigate('/projects');
    } catch (error) {
      console.error("Error deleting project:", error);
      setError(error.message);
    }
  };

  if (!project) return <p>Loading project details...</p>;

  // Dashboard Data Preparation
  // Gantt Chart Data
  const ganttData = [
    [
      { type: "string", label: "Task ID" },
      { type: "string", label: "Task Name" },
      { type: "date", label: "Start Date" },
      { type: "date", label: "End Date" },
      { type: "number", label: "Duration" },
      { type: "number", label: "Percent Complete" },
      { type: "string", label: "Dependencies" }
    ],
    ...tasks.map((task, index) => [
      `Task${index + 1}`,
      task.name,
      new Date(task.startDate),
      new Date(task.endDate),
      null,
      task.status === "Completed" ? 100 : 0,
      task.dependencies?.join(", ") || ""
    ]),
  ];

  // Pending Work Tracker Data
  const pendingHigh = tasks.filter(task => task.priority === "High" && task.status !== "Completed").length;
  const pendingMedium = tasks.filter(task => task.priority === "Medium" && task.status !== "Completed").length;
  const pendingLow = tasks.filter(task => task.priority === "Low" && task.status !== "Completed").length;

  const priorityData = [
    ["Priority", "Tasks"],
    ["High", pendingHigh],
    ["Medium", pendingMedium],
    ["Low", pendingLow],
  ];

  const priorityOptions = {
    title: "Pending Work Tracker (By Priority)",
    is3D: true,
    colors: ['#E76F51', '#F4A261', '#2A9D8F'],
    backgroundColor: '#F2F6EB',
    titleTextStyle: { color: '#3E5F4D', fontSize: 16, bold: true },
    legend: { position: 'bottom', textStyle: { color: '#3E5F4D' } }
  };

  // Performance Improvement Analysis Data
  const performanceData = [
    ["Time", "Completed Tasks", "New Tasks"],
    ["Week 1", 10, 15],
    ["Week 2", 15, 12],
    ["Week 3", 20, 10],
    ["Week 4", 25, 8],
  ];

  const performanceOptions = {
    title: "Performance Improvement Analysis",
    curveType: "function",
    legend: { position: "bottom" },
    backgroundColor: '#F2F6EB',
    colors: ['#3a856c', '#B85042'],
    titleTextStyle: { color: '#3E5F4D', fontSize: 16, bold: true },
    hAxis: { textStyle: { color: '#3E5F4D' } },
    vAxis: { textStyle: { color: '#3E5F4D' } }
  };

  // Completed Work Overview Data
  const completedCategories = [...new Set(tasks.map(task => task.priority))];
  const completedData = [["Priority", "Completed", "Pending"]];

  completedCategories.forEach(category => {
    const completedCount = tasks.filter(task => task.priority === category && task.status === "Completed").length;
    const pendingCount = tasks.filter(task => task.priority === category && task.status !== "Completed").length;
    completedData.push([category, completedCount, pendingCount]);
  });

  const completedOptions = {
    title: "Completed Work Overview",
    isStacked: true,
    hAxis: { title: "Tasks", textStyle: { color: '#3E5F4D' } },
    vAxis: { title: "Priority", textStyle: { color: '#3E5F4D' } },
    backgroundColor: '#F2F6EB',
    colors: ['#3a856c', '#B85042'],
    titleTextStyle: { color: '#3E5F4D', fontSize: 16, bold: true },
    legend: { position: 'top', textStyle: { color: '#3E5F4D' } }
  };

  // Notifications Dashboard Data
  const notificationTypes = Array.from(new Set(notifications.map(n => n.type)));
  const notificationData = [["Type", "Count"]];
  
  notificationTypes.forEach(type => {
    const count = notifications.filter(n => n.type === type).length;
    notificationData.push([type, count]);
  });

  const notificationOptions = {
    title: "Notifications Dashboard",
    pieHole: 0.4,
    backgroundColor: '#F2F6EB',
    colors: ['#4CAF50', '#FF9800', '#E76F51', '#3a856c'],
    titleTextStyle: { color: '#3E5F4D', fontSize: 16, bold: true },
    legend: { position: 'bottom', textStyle: { color: '#3E5F4D' } }
  };

  // Timeline chart for notifications
  const timelineData = [
    [
      { type: "string", id: "Type" },
      { type: "string", id: "Name" },
      { type: "date", id: "Start" },
      { type: "date", id: "End" },
    ],
    ...notifications.map((notification, index) => [
      notification.type,
      notification.content,
      new Date(notification.date),
      new Date(new Date(notification.date).setHours(new Date(notification.date).getHours() + 1))
    ])
  ];

  const timelineOptions = {
    title: "Project Notifications Timeline",
    backgroundColor: '#F2F6EB',
    titleTextStyle: { color: '#3E5F4D', fontSize: 16, bold: true },
    colors: ['#4CAF50', '#FF9800', '#E76F51', '#3a856c']
  };

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>{project.name}</h1>
        <p style={styles.subtitle}>{project.description}</p>
        <p style={styles.deadline}>Deadline: {new Date(project.deadline).toDateString()}</p>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onClick={() => {
              setShowTasks(!showTasks);
              setShowProgress(false);
              setShowResources(false);
              setShowCollaborators(false);
              setShowDashboard(false);
            }}
          >
            Tasks
          </button>
          <button
            style={styles.button}
            onClick={() => {
              setShowResources(!showResources);
              setShowTasks(false);
              setShowProgress(false);
              setShowCollaborators(false);
              setShowDashboard(false);
            }}
          >
            Resources
          </button>
          <button
            style={styles.button}
            onClick={() => {
              setShowCollaborators(!showCollaborators);
              setShowTasks(false);
              setShowProgress(false);
              setShowResources(false);
              setShowDashboard(false);
            }}
          >
            Collaborators
          </button>
          <button
            style={styles.button}
            onClick={() => {
              setShowProgress(!showProgress);
              setShowTasks(false);
              setShowResources(false);
              setShowCollaborators(false);
              setShowDashboard(false);
            }}
          >
            Progress
          </button>
          <button
            style={styles.button}
            onClick={() => {
              setShowDashboard(!showDashboard);
              setShowTasks(false);
              setShowProgress(false);
              setShowResources(false);
              setShowCollaborators(false);
            }}
          >
            Dashboard
          </button>
          
          <button style={{ ...styles.button, backgroundColor: "#B85042" }} onClick={deleteProject}>Delete Project</button>
        </div>

        {showTasks ? (
          <div style={styles.taskContainer}>
            <h3 style={styles.sectionTitle}>Add Task</h3>
            <div style={styles.taskForm}>
              <input type="text" placeholder="Task Name" value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} style={styles.input} />
              <input type="date" value={newTask.startDate} onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })} style={styles.input} />
              <input type="date" value={newTask.endDate} onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })} style={styles.input} />
              <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} style={styles.input}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <input type="text" placeholder="Dependencies" value={newTask.dependencies} onChange={(e) => setNewTask({ ...newTask, dependencies: e.target.value })} style={styles.input} />
              <button onClick={addTask} style={styles.addButton}>Add Task</button>
            </div>

            <h3 style={styles.sectionTitle}>Task List</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Task Name</th>
                  <th style={styles.th}>Start Date</th>
                  <th style={styles.th}>End Date</th>
                  <th style={styles.th}>Priority</th>
                  <th style={styles.th}>Dependencies</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task._id} style={{ ...styles.tr, backgroundColor: getPriorityColor(task.priority) }}>
                    <td style={styles.td}>{task.name}</td>
                    <td style={styles.td}>{new Date(task.startDate).toLocaleDateString()}</td>
                    <td style={styles.td}>{new Date(task.endDate).toLocaleDateString()}</td>
                    <td style={styles.td}>{task.priority}</td>
                    <td style={styles.td}>{task.dependencies?.join(", ") || "None"}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => completeTask(task._id)}
                        disabled={task.status === 'Completed'}
                        style={{ ...styles.actionButton, backgroundColor: "#4CAF50", marginRight: '5px' }}>
                        Complete
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        style={{ ...styles.actionButton, backgroundColor: "#B85042" }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={styles.sectionTitle}>Gantt Chart</h3>
            <div
              className="gantt-chart-container"
              style={{
                overflowX: "scroll",
                whiteSpace: "nowrap",
                minWidth: "1000px",
                margin: "0 auto",
                paddingBottom: "20px"
              }}
            >
              <Chart
                chartType="Gantt"
                data={ganttData}
                width="100%"
                height="400px"
                options={{
                  gantt: {
                    trackHeight: 30,
                  },
                }}
              />
            </div>
          </div>
        ) : showProgress ? (
          <div style={styles.progressContainer}>
            <h3 style={styles.sectionTitle}>Project Progress</h3>
            <Chart
              chartType="PieChart"
              data={priorityData}
              options={priorityOptions}
              width={"100%"}
              height={"400px"}
            />
            <Chart
              chartType="LineChart"
              data={performanceData}
              options={performanceOptions}
              width={"100%"}
              height={"400px"}
            />
            <Chart
              chartType="BarChart"
              data={completedData}
              options={completedOptions}
              width={"100%"}
              height={"400px"}
            />
          </div>
        ) : showResources ? (
          <div style={styles.resourcesContainer}>
            <h3 style={styles.sectionTitle}>Project Resources</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Type</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(resource => (
                  <tr key={resource.id} style={styles.tr}>
                    <td style={styles.td}>{resource.name}</td>
                    <td style={styles.td}>{resource.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : showCollaborators ? (
          <div style={styles.collaboratorsContainer}>
            <h3 style={styles.sectionTitle}>Project Collaborators</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Role</th>
                </tr>
              </thead>
              <tbody>
                {collaborators.map(collaborator => (
                  <tr key={collaborator.id} style={styles.tr}>
                    <td style={styles.td}>{collaborator.name}</td>
                    <td style={styles.td}>{collaborator.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : showDashboard ? (
          <div style={styles.dashboardContainer}>
            <h3 style={styles.sectionTitle}>Statistical Dashboards</h3>
            
            <div style={styles.dashboardGrid}>
              <div style={styles.dashboardCard}>
                <Chart
                  chartType="PieChart"
                  data={priorityData}
                  options={{
                    ...priorityOptions,
                    title: "Pending Work Tracker",
                  }}
                  width={"100%"}
                  height={"300px"}
                />
              </div>
              
              <div style={styles.dashboardCard}>
                <Chart
                  chartType="PieChart"
                  data={notificationData}
                  options={notificationOptions}
                  width={"100%"}
                  height={"300px"}
                />
              </div>
              
              <div style={styles.dashboardCard}>
                <Chart
                  chartType="LineChart"
                  data={performanceData}
                  options={{
                    ...performanceOptions,
                    title: "Performance Analysis"
                  }}
                  width={"100%"}
                  height={"300px"}
                />
              </div>
              
              <div style={styles.dashboardCard}>
                <Chart
                  chartType="BarChart"
                  data={completedData}
                  options={{
                    ...completedOptions,
                    title: "Completed vs. Pending Work"
                  }}
                  width={"100%"}
                  height={"300px"}
                />
              </div>
            </div>
            
            <div style={styles.timelineContainer}>
              <h3 style={styles.subSectionTitle}>Notifications Timeline</h3>
              <Chart
                chartType="Timeline"
                data={timelineData}
                options={timelineOptions}
                width={"100%"}
                height={"300px"}
              />
            </div>
            
            <div style={styles.notificationsTable}>
              <h3 style={styles.subSectionTitle}>Recent Notifications</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Message</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.slice(0, 5).map(notification => (
                    <tr key={notification.id} style={{...styles.tr, backgroundColor: getNotificationColor(notification.type)}}>
                      <td style={styles.td}>{notification.type}</td>
                      <td style={styles.td}>{notification.content}</td>
                      <td style={styles.td}>{new Date(notification.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
      <Footer />
    </>
  );
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return '#FFd6c9';
    case 'Medium':
      return '#FFFACD';
    case 'Low':
      return '#D1E7DD';
    default:
      return '#FFFFFF';
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'Mention':
      return '#E8F5E9';
    case 'Meeting':
      return '#FFF3E0';
    case 'Deadline':
      return '#FFEBEE';
    case 'Update':
      return '#E3F2FD';
    default:
      return '#FFFFFF';
  }
};

const styles = {
  container: { textAlign: "center", padding: "30px", backgroundColor: "#4E7A59", minHeight: "80vh" },
  title: { fontSize: "32px", fontWeight: "bold", color: "#F2F6EB", marginBottom: "10px" },
  subtitle: { fontSize: "18px", color: "#E0E0E0" },
  deadline: { fontSize: "16px", color: "#FFD700", fontWeight: "bold" },
  buttonContainer: { display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px", flexWrap: "wrap" },
  button: { backgroundColor: "#3a856c", fontWeight: "3px", color: "#F2F6EB", padding: "15px 20px", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", outline: "none", margin: "10px" },
  taskContainer: { marginTop: "20px", padding: "20px", backgroundColor: "#F2F6EB", borderRadius: "10px" },
  taskForm: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "10px", marginBottom: "20px" },
  input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" },
  addButton: { backgroundColor: "#3a856c", color: "white", padding: "10px", borderRadius: "5px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#3E5F4D", color: "white", padding: "12px" },
  td: { padding: "10px", border: "1px solid #ddd" },
  tr: { background: "#F8F9FA" },
  ganttContainer: { overflowX: "auto", whiteSpace: "nowrap", minWidth: "1000px" },
  actionButton: {
    color: 'white',
    padding: '8px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none'
  },
  progressContainer: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#F2F6EB",
    borderRadius: "10px"
  },
  resourcesContainer: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#F2F6EB",
    borderRadius: "10px"
  },
  collaboratorsContainer: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#F2F6EB",
    borderRadius: "10px"
  },
  dashboardContainer: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#F2F6EB",
    borderRadius: "10px"
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginBottom: "30px"
  },
  dashboardCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  },
  timelineContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "30px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  },
  notificationsTable: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#3E5F4D",
    borderBottom: "2px solid #3a856c",
    paddingBottom: "10px"
  },
  subSectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#3E5F4D"
  }
};

export default ProjectDetails;
import React, { useState, useEffect } from "react";
import { graph, cabs } from "./data";
import axios from "axios";

export const CabBooking = () => {
  const [booking, setBooking] = useState({
    source: "",
    destination: "",
    cabName: "",
  });

  const [bookedCabs, setBookedCabs] = useState({});
  const [cost, setCost] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (booking.source && booking.destination) {
      const tripCosts = getShortestPathCost(
        graph,
        booking.source,
        booking.destination
      );
      setCost(tripCosts);

      const cheapestCab = findCheapestCab();
      if (cheapestCab && cheapestCab.id) {
        updateCabTime(cheapestCab.id, tripCosts);
      }
    }
    axios
      .get("http://localhost:8000/api/booking")
      .then((response) => {
        // Handle the data, maybe set it to state
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
    <ul>
      {Object.entries(cabs)
        .filter(
          ([key]) =>
            !bookedCabs[booking.source] || bookedCabs[booking.source] !== key
        )
        .map(([key, value]) => (
          <li key={key}>
            {key}: Price - {value.price}, Start Time - {value.startTime}
          </li>
        ))}
    </ul>;
  }, [booking]);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState({
    source: "",
    destination: "",
  });

  const handleCreation = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
    });
  };

  const updateCabTime = (cabId, minutes) => {
    const cab = cabs[cabId];
    let [startHours, startMins] = cab.startTime.split(":").map(Number);

    let endMins = startMins + minutes;
    let endHours = startHours;

    if (endMins >= 60) {
      endHours += Math.floor(endMins / 60);
      endMins %= 60;
    }

    cab.endTime = `${String(endHours).padStart(2, "0")}:${String(
      endMins
    ).padStart(2, "0")}`;

    cabs[cabId] = cab;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData({
      source: booking.source,
      destination: booking.destination,
    });
    setFormSubmitted(true);

    // Calculate cost
    const tripCost = getShortestPathCost(
      graph,
      booking.source,
      booking.destination
    );
    setCost(tripCost);

    setBookedCabs((prev) => {
      return { ...prev, [booking.source]: cheapestCab.id };
    });

    const datam = {
      source: booking.source,
      destination: booking.destination,
      cabName: cheapestCab?.id,
      tripCost: cost,
      startTime: cheapestCab?.startTime,
      endTime: cheapestCab?.endTime,
    };

    axios
      .post("http://localhost:8000/api/booking", datam)
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log("Error couldn't create Booking");
        console.log(err.message);
      });
  };

  //To find the cheapest cab
  const findCheapestCab = () => {
    const availableCabs = Object.entries(cabs).filter(
      ([key]) =>
        !bookedCabs[booking.source] || bookedCabs[booking.source] !== key
    );
    return availableCabs.reduce((acc, [key, currCab]) => {
      if (!acc || currCab.price < acc.price) {
        return { ...currCab, id: key }; // Return the cab's data and its ID
      }
      return acc;
    }, null);
  };

  //Function call to cheapest cab
  const cheapestCab = findCheapestCab();
  if (cheapestCab && cheapestCab.id) {
    updateCabTime(cheapestCab.id, cost);
  }

  //Dijkstra Algorithm to find shortest path.
  const dijkstra = (graph, start) => {
    let distances = {};
    let prev = {};
    let nodes = new Set(Object.keys(graph));

    for (let node of nodes) {
      distances[node] = Infinity;
      prev[node] = null;
    }

    distances[start] = 0;

    while (nodes.size !== 0) {
      let closestNode = null;

      for (let node of nodes) {
        if (closestNode === null || distances[node] < distances[closestNode]) {
          closestNode = node;
        }
      }

      nodes.delete(closestNode);

      for (let neighbor in graph[closestNode]) {
        let distanceThroughClosestNode =
          distances[closestNode] + graph[closestNode][neighbor];

        if (distanceThroughClosestNode < distances[neighbor]) {
          distances[neighbor] = distanceThroughClosestNode;
          prev[neighbor] = closestNode;
        }
      }
    }

    return { distances, prev };
  };

  //Function to call dijkstra function
  const getShortestPathCost = (graph, start, end) => {
    let { distances } = dijkstra(graph, start);
    return distances[end];
  };

  /*const handleUpdate = (bookingId) => {
    const updatedData = {
      cabName: "NEW_CAB_NAME", // update this as per your logic
    };
    axios
      .put(`http://localhost:8000/api/booking/${bookingId}`, updatedData)
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log("Error updating booking:", err.message);
      });
  };*/

  return (
    <>
      <h1>Available Cabs</h1>
      <div>
        <h2>Cabs Data:</h2>
        <ul>
          {Object.entries(cabs).map(([key, value]) => (
            <li key={key}>
              {key}: Price - {value.price}, Start Time - {value.startTime}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="source">Source</label>
        <br />
        <input
          type="text"
          id="source"
          name="source"
          value={booking.source}
          onChange={handleCreation}
        />
        <br />
        <label htmlFor="destination">Destination</label>
        <br />
        <input
          type="text"
          id="destination"
          name="destination"
          value={booking.destination}
          onChange={handleCreation}
        />
        <br />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Enter</button>
      </form>

      {formSubmitted && (
        <>
          <h1>Source: {submittedData.source}</h1>
          <h1>Destination: {submittedData.destination}</h1>
          <h1>Cheapest Cab Name: {cheapestCab?.id}</h1>
          <h1>Trip Cost: {cost}</h1>
          <h1>Start Time:{cheapestCab?.startTime}</h1>
          <h1>End Time:{cheapestCab?.endTime}</h1>
          <h1>Total trip Cost :{cost * cheapestCab?.price}</h1>
          <h1>Email:{email}</h1>
        </>
      )}
    </>
  );
};

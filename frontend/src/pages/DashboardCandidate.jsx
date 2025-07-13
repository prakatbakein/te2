import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { getFavorites } from "../services/favoriteService";
import { fetchJobs } from "../services/jobService";
import JobCard from "../components/jobs/JobCard";
import {
  Briefcase,
  Calendar,
  Eye,
  Heart,
  TrendingUp,
  FileText,
  Bell,
  Search,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const DashboardCandidate = () => {
  const [favorites, setFavorites] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for applications - in real app, fetch from API
  const mockApplications = [
    {
      id: "1",
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      status: "pending",
      appliedDate: "2024-12-10",
      salary: "$120,000 - $150,000",
    },
    {
      id: "2",
      jobTitle: "UX/UI Designer",
      company: "Creative Studio",
      status: "interview",
      appliedDate: "2024-12-08",
      salary: "$85,000 - $110,000",
    },
    {
      id: "3",
      jobTitle: "Full Stack Developer",
      company: "Startup Innovations",
      status: "rejected",
      appliedDate: "2024-12-05",
      salary: "$90,000 - $120,000",
    },
  ];

  const stats = [
    {
      icon: Briefcase,
      label: "Applications Sent",
      value: "12",
      change: "+3 this week",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Calendar,
      label: "Interviews Scheduled",
      value: "3",
      change: "+1 this week",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Eye,
      label: "Profile Views",
      value: "45",
      change: "+8 this week",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Heart,
      label: "Saved Jobs",
      value: favorites.length.toString(),
      change: `${favorites.length > 0 ? "+" : ""}${favorites.length} total`,
      color: "from-red-500 to-red-600",
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [favoritesData, jobsData] = await Promise.all([
          getFavorites(),
          fetchJobs(),
        ]);

        setFavorites(favoritesData);
        setApplications(mockApplications);
        setRecommendedJobs(jobsData.slice(0, 3)); // Show first 3 as recommended
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "interview":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "interview":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Candidate Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track your applications, discover new opportunities, and manage your
            job search
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6">
              <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
                <CardTitle className="text-xl font-semibold">
                  Recent Applications
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {application.jobTitle}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {application.company}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Applied{" "}
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">
                          {application.status}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended Jobs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6">
              <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
                <CardTitle className="text-xl font-semibold">
                  Recommended Jobs
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Browse All
                </Button>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {recommendedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {job.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {job.company} • {job.location}
                        </p>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                          {job.salary}
                        </p>
                      </div>
                      <Button size="sm" className="text-xs">
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Saved Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Saved Jobs ({favorites.length})
              </CardTitle>
              {favorites.length > 0 && (
                <Button variant="outline" size="sm">
                  Manage All
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {favorites.length > 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    You have {favorites.length} saved job
                    {favorites.length !== 1 ? "s" : ""}
                  </p>
                  <Button className="mt-4">View Saved Jobs</Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No saved jobs yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start saving jobs you're interested in to easily find them
                    later
                  </p>
                  <Button>
                    <Search className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardCandidate;

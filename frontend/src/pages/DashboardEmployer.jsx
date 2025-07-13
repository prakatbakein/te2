import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { fetchJobs } from "../services/jobService";
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Star,
} from "lucide-react";

const DashboardEmployer = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for applications - in real app, fetch from API
  const mockApplications = [
    {
      id: "1",
      candidateName: "John Doe",
      jobTitle: "Senior Frontend Developer",
      appliedDate: "2024-12-10",
      status: "pending",
      experience: "5 years",
      rating: 4.5,
    },
    {
      id: "2",
      candidateName: "Jane Smith",
      jobTitle: "UX/UI Designer",
      appliedDate: "2024-12-08",
      status: "interview",
      experience: "3 years",
      rating: 4.8,
    },
    {
      id: "3",
      candidateName: "Mike Johnson",
      jobTitle: "Backend Engineer",
      appliedDate: "2024-12-05",
      status: "hired",
      experience: "4 years",
      rating: 4.7,
    },
  ];

  const stats = [
    {
      icon: Briefcase,
      label: "Active Jobs",
      value: "5",
      change: "+2 this month",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      label: "Total Applications",
      value: "28",
      change: "+12 this week",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Calendar,
      label: "Interviews Scheduled",
      value: "8",
      change: "+3 this week",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Successful Hires",
      value: "3",
      change: "+1 this month",
      color: "from-orange-500 to-orange-600",
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const jobsData = await fetchJobs();
        setJobs(jobsData.slice(0, 4)); // Show first 4 jobs
        setApplications(mockApplications);
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
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case "hired":
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
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400";
      case "hired":
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Employer Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Manage your job postings, review applications, and hire top
                talent
              </p>
            </div>
            <motion.div
              className="mt-4 sm:mt-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate("/post-job")}
                className="flex items-center space-x-2"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                <span>Post New Job</span>
              </Button>
            </motion.div>
          </div>
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
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {application.candidateName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {application.candidateName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Applied for {application.jobTitle}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {application.experience} experience
                          </span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                              {application.rating}
                            </span>
                          </div>
                        </div>
                      </div>
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
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6">
              <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
                <CardTitle className="text-xl font-semibold">
                  Job Performance
                </CardTitle>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {jobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {job.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {job.company} • {job.location}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {Math.floor(Math.random() * 100 + 50)} views
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {Math.floor(Math.random() * 20 + 5)} applications
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Posted {Math.floor(Math.random() * 30 + 1)} days ago
                        </span>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl font-semibold">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate("/post-job")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Post New Job
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create a new job posting
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Browse Candidates
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Find qualified candidates
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        View Analytics
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Track hiring metrics
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardEmployer;

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Users, Plus, Search, Star, StarOff, Eye, Download, Trash2, 
  Moon, Sun, LogOut, Filter, TrendingUp, Bookmark 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  createdDate: string;
  candidateCount: number;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  resumeFilename: string;
  score: number;
  matchedJobId: string;
  uploadDate: string;
  skills: string[];
  experience: string;
  isBookmarked: boolean;
}

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [minScore, setMinScore] = useState<number>(0);
  const [topCount, setTopCount] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp",
      description: "We are looking for a Senior Frontend Developer with React experience...",
      createdDate: "2024-01-15",
      candidateCount: 25
    },
    {
      id: "2", 
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      description: "Join our team as a Full Stack Engineer working with Node.js and React...",
      createdDate: "2024-01-20",
      candidateCount: 18
    }
  ]);

  const [candidates] = useState<Candidate[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@email.com",
      resumeFilename: "john_doe_resume.pdf",
      score: 92,
      matchedJobId: "1",
      uploadDate: "2024-01-22",
      skills: ["React", "TypeScript", "Node.js", "AWS"],
      experience: "5 years",
      isBookmarked: true
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@email.com", 
      resumeFilename: "jane_smith_resume.pdf",
      score: 88,
      matchedJobId: "1",
      uploadDate: "2024-01-21",
      skills: ["React", "JavaScript", "Python", "Docker"],
      experience: "4 years",
      isBookmarked: false
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      resumeFilename: "mike_johnson_resume.pdf", 
      score: 85,
      matchedJobId: "2",
      uploadDate: "2024-01-20",
      skills: ["Node.js", "MongoDB", "React", "Express"],
      experience: "3 years",
      isBookmarked: true
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      resumeFilename: "sarah_wilson_resume.pdf",
      score: 79,
      matchedJobId: "1",
      uploadDate: "2024-01-19",
      skills: ["Vue.js", "JavaScript", "CSS", "HTML"],
      experience: "2 years", 
      isBookmarked: false
    }
  ]);

  const [newJobData, setNewJobData] = useState({
    title: "",
    company: "",
    description: ""
  });

  const filteredCandidates = candidates.filter(candidate => {
    const matchesJob = selectedJobId ? candidate.matchedJobId === selectedJobId : true;
    const matchesScore = candidate.score >= minScore;
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesJob && matchesScore && matchesSearch;
  }).slice(0, topCount);

  const bookmarkedCandidates = candidates.filter(candidate => candidate.isBookmarked);

  const handleAddJob = () => {
    if (!newJobData.title || !newJobData.company || !newJobData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newJob: JobDescription = {
      id: Date.now().toString(),
      title: newJobData.title,
      company: newJobData.company,
      description: newJobData.description,
      createdDate: new Date().toISOString().split('T')[0],
      candidateCount: 0
    };

    setJobDescriptions([...jobDescriptions, newJob]);
    setNewJobData({ title: "", company: "", description: "" });
    
    toast({
      title: "Job description added",
      description: "New job description has been created successfully",
    });
  };

  const handleDeleteJob = (jobId: string) => {
    setJobDescriptions(jobDescriptions.filter(job => job.id !== jobId));
    toast({
      title: "Job description deleted",
      description: "Job description has been removed",
    });
  };

  const toggleBookmark = (candidateId: string) => {
    // In a real app, this would update the backend
    toast({
      title: "Bookmark updated",
      description: "Candidate bookmark status has been updated",
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    navigate("/");
    toast({
      title: "Logged out successfully", 
      description: "See you next time!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Resume Matcher
            </h1>
            <Badge variant="secondary">Recruiter</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="candidates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="jobs">Job Descriptions</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Candidates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Job Description</Label>
                    <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                      <SelectTrigger>
                        <SelectValue placeholder="All jobs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All jobs</SelectItem>
                        {jobDescriptions.map(job => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Minimum Score</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={minScore}
                      onChange={(e) => setMinScore(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Top Candidates</Label>
                    <Input
                      type="number"
                      min="1"
                      value={topCount}
                      onChange={(e) => setTopCount(Number(e.target.value))}
                      placeholder="10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search candidates..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Candidates List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Candidates ({filteredCandidates.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredCandidates.map((candidate) => (
                      <Card key={candidate.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div>
                                <h4 className="font-medium">{candidate.name}</h4>
                                <p className="text-sm text-muted-foreground">{candidate.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={candidate.score >= 85 ? "default" : candidate.score >= 70 ? "secondary" : "outline"}>
                                {candidate.score}%
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => toggleBookmark(candidate.id)}
                              >
                                {candidate.isBookmarked ? 
                                  <Star className="h-4 w-4 fill-current text-yellow-500" /> : 
                                  <StarOff className="h-4 w-4" />
                                }
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Experience: {candidate.experience}</span>
                              <span>Uploaded: {new Date(candidate.uploadDate).toLocaleDateString()}</span>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Skills:</p>
                              <div className="flex flex-wrap gap-1">
                                {candidate.skills.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {filteredCandidates.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No candidates match your current filters
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            {/* Add Job Dialog */}
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Job Description
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Job Description</DialogTitle>
                    <DialogDescription>
                      Create a new job description to match candidates against
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                          placeholder="e.g. Senior Frontend Developer"
                          value={newJobData.title}
                          onChange={(e) => setNewJobData({...newJobData, title: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          placeholder="e.g. TechCorp"
                          value={newJobData.company}
                          onChange={(e) => setNewJobData({...newJobData, company: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Job Description</Label>
                      <Textarea
                        placeholder="Paste the complete job description here..."
                        className="min-h-[200px]"
                        value={newJobData.description}
                        onChange={(e) => setNewJobData({...newJobData, description: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleAddJob} className="w-full">
                      Add Job Description
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Job Descriptions List */}
            <Card>
              <CardHeader>
                <CardTitle>Job Descriptions</CardTitle>
                <CardDescription>
                  Manage your job descriptions and view candidate matches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobDescriptions.map((job) => (
                    <Card key={job.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {job.candidateCount} candidates
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>Created: {new Date(job.createdDate).toLocaleDateString()}</p>
                          <p className="mt-2 line-clamp-2">{job.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  Bookmarked Candidates
                </CardTitle>
                <CardDescription>
                  Your saved candidates from all job descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookmarkedCandidates.map((candidate) => (
                    <Card key={candidate.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="font-medium">{candidate.name}</h4>
                              <p className="text-sm text-muted-foreground">{candidate.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={candidate.score >= 85 ? "default" : candidate.score >= 70 ? "secondary" : "outline"}>
                              {candidate.score}%
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => toggleBookmark(candidate.id)}
                            >
                              <Star className="h-4 w-4 fill-current text-yellow-500" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Experience: {candidate.experience}</span>
                            <span>Uploaded: {new Date(candidate.uploadDate).toLocaleDateString()}</span>
                            <span>Job: {jobDescriptions.find(job => job.id === candidate.matchedJobId)?.title}</span>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {bookmarkedCandidates.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No bookmarked candidates yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
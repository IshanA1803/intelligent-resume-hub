import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, FileText, TrendingUp, Star, Moon, Sun, LogOut, Bot, Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ResumeVersion {
  id: string;
  version: number;
  filename: string;
  uploadDate: string;
  score: number;
  jobDescription: string;
  improvements: string[];
  suggestions: string[];
}

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showAiOverview, setShowAiOverview] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeVersions] = useState<ResumeVersion[]>([
    {
      id: "1",
      version: 1,
      filename: "resume_v1.pdf",
      uploadDate: "2024-01-15",
      score: 62,
      jobDescription: "Software Engineer at Google",
      improvements: ["Added React skills", "Improved project descriptions"],
      suggestions: ["Add more quantifiable achievements", "Include AWS certifications"]
    },
    {
      id: "2",
      version: 2,
      filename: "resume_v2.pdf",
      uploadDate: "2024-01-20",
      score: 78,
      jobDescription: "Software Engineer at Google",
      improvements: ["Added quantifiable achievements", "Improved action verbs"],
      suggestions: ["Include leadership experience", "Add system design projects"]
    },
    {
      id: "3",
      version: 3,
      filename: "resume_v3.pdf",
      uploadDate: "2024-01-25",
      score: 85,
      jobDescription: "Frontend Developer at Microsoft",
      improvements: ["Added leadership experience", "Included TypeScript skills"],
      suggestions: ["Add accessibility knowledge", "Include testing frameworks"]
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setCurrentFile(file);
    toast({
      title: "File uploaded successfully",
      description: `${file.name} is ready for analysis`,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!currentFile || !jobDescription) {
      toast({
        title: "Missing information",
        description: "Please upload a resume and enter a job description",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResult({
        overallScore: 82,
        breakdown: {
          skillMatch: 85,
          experience: 78,
          education: 90,
          keywords: 75
        },
        missingSkills: ["Docker", "Kubernetes", "GraphQL"],
        strengths: ["Strong React experience", "Good project portfolio", "Relevant education"],
        suggestions: [
          "Add Docker and containerization experience",
          "Include more backend technologies",
          "Quantify your impact with metrics"
        ]
      });
      setIsAnalyzing(false);
      toast({
        title: "Analysis complete!",
        description: "Your resume has been analyzed against the job description",
      });
    }, 3000);
  };

  const handleGetAiOverview = () => {
    setShowAiOverview(true);
    toast({
      title: "AI Overview generated",
      description: "Detailed suggestions are now available",
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
            <Badge variant="secondary">Candidate</Badge>
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
        <Tabs defaultValue="analyzer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analyzer">Resume Analyzer</TabsTrigger>
            <TabsTrigger value="history">Resume History</TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Resume
                  </CardTitle>
                  <CardDescription>
                    Upload your resume in PDF or DOCX format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
                      isDragActive 
                        ? 'border-primary bg-primary/5 scale-[1.02]' 
                        : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleUploadClick}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <FileText className={`h-12 w-12 mx-auto mb-4 transition-colors ${
                      isDragActive ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    {currentFile ? (
                      <div>
                        <p className="font-medium">{currentFile.name}</p>
                        <p className="text-sm text-muted-foreground">Click to change file or drop a new one</p>
                      </div>
                    ) : (
                      <div>
                        <p className={`font-medium transition-colors ${
                          isDragActive ? 'text-primary' : ''
                        }`}>
                          {isDragActive ? 'Drop your resume here' : 'Drop your resume here'}
                        </p>
                        <p className="text-sm text-muted-foreground">or click to browse</p>
                        <p className="text-xs text-muted-foreground mt-2">PDF or DOCX files only (max 10MB)</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Job Description Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                  <CardDescription>
                    Paste the job description you want to match against
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste the complete job description here..."
                    className="min-h-[200px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleAnalyze} 
                size="lg" 
                disabled={!currentFile || !jobDescription || isAnalyzing}
                className="min-w-[200px]"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
              </Button>
            </div>

            {/* Analysis Results */}
            {analysisResult && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Analysis Results</span>
                      <Badge variant={analysisResult.overallScore >= 80 ? "default" : "secondary"}>
                        {analysisResult.overallScore}% Match
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Score Breakdown */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Skill Match</span>
                            <span>{analysisResult.breakdown.skillMatch}%</span>
                          </div>
                          <Progress value={analysisResult.breakdown.skillMatch} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Experience</span>
                            <span>{analysisResult.breakdown.experience}%</span>
                          </div>
                          <Progress value={analysisResult.breakdown.experience} />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Education</span>
                            <span>{analysisResult.breakdown.education}%</span>
                          </div>
                          <Progress value={analysisResult.breakdown.education} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Keywords</span>
                            <span>{analysisResult.breakdown.keywords}%</span>
                          </div>
                          <Progress value={analysisResult.breakdown.keywords} />
                        </div>
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div>
                      <h4 className="font-medium mb-2">Missing Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.missingSkills.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Strengths */}
                    <div>
                      <h4 className="font-medium mb-2">Strengths</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {analysisResult.strengths.map((strength: string, index: number) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Overview Button */}
                    <div className="flex justify-center">
                      <Button 
                        onClick={handleGetAiOverview} 
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Bot className="h-4 w-4" />
                        Get AI-Powered Suggestions
                      </Button>
                    </div>

                    {/* AI Overview */}
                    {showAiOverview && (
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            AI-Powered Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {analysisResult.suggestions.map((suggestion: string, index: number) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                                <Star className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <p className="text-sm">{suggestion}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Resume Version History
                </CardTitle>
                <CardDescription>
                  Track your resume improvements over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {resumeVersions.map((version) => (
                      <Card key={version.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">v{version.version}</Badge>
                              <h4 className="font-medium">{version.filename}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={version.score >= 80 ? "default" : "secondary"}>
                                {version.score}%
                              </Badge>
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground">
                              Uploaded: {new Date(version.uploadDate).toLocaleDateString()}
                            </p>
                            <p className="text-muted-foreground">
                              Job: {version.jobDescription}
                            </p>
                            
                            {version.improvements.length > 0 && (
                              <div>
                                <p className="font-medium text-green-600 mb-1">Improvements:</p>
                                <ul className="list-disc list-inside text-muted-foreground">
                                  {version.improvements.map((improvement, index) => (
                                    <li key={index}>{improvement}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {version.suggestions.length > 0 && (
                              <div>
                                <p className="font-medium text-orange-600 mb-1">Remaining suggestions:</p>
                                <ul className="list-disc list-inside text-muted-foreground">
                                  {version.suggestions.map((suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CandidateDashboard;
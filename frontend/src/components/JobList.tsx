interface Job {
  title: string;
  company: string;
  description: string;
  email: string;
  similarity_score: number;
}

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
}

export function JobList({ jobs, isLoading }: JobListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        No jobs found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {jobs.map((job, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
              <p className="text-gray-600 mt-1">{job.company}</p>
            </div>
            <span className="text-sm text-gray-500">
              Match: {Math.round(job.similarity_score * 100)}%
            </span>
          </div>
          <p className="mt-4 text-gray-700 line-clamp-3">{job.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <a
              href={`mailto:${job.email}`}
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
            >
              <i className="fas fa-envelope"></i>
              Apply Now
            </a>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => {/* Implement save job functionality */}}
            >
              <i className="far fa-bookmark"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 
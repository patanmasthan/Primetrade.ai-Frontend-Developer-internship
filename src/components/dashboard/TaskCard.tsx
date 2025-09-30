import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  Circle,
  AlertCircle 
} from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-warning" />;
      default: return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      default: return 'outline';
    }
  };

  const isOverdue = task.due_date && isAfter(new Date(), new Date(task.due_date)) && task.status !== 'completed';
  const isDueSoon = task.due_date && isBefore(new Date(task.due_date), addDays(new Date(), 3)) && task.status !== 'completed';

  const handleStatusChange = async (newStatus: Task['status']) => {
    setIsChangingStatus(true);
    await onStatusChange(task.id, newStatus);
    setIsChangingStatus(false);
  };

  return (
    <Card className={`transition-all hover:shadow-md ${task.status === 'completed' ? 'opacity-80' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={getPriorityColor(task.priority) as any}>
            {task.priority}
          </Badge>
          <Badge variant={getStatusBadgeVariant(task.status) as any}>
            {task.status.replace('-', ' ')}
          </Badge>
          {isOverdue && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Overdue
            </Badge>
          )}
          {isDueSoon && !isOverdue && (
            <Badge variant="warning" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Due Soon
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
        )}
        
        {task.due_date && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <Clock className="h-3 w-3" />
            Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
          </div>
        )}
        
        <div className="flex gap-2 flex-wrap">
          {task.status !== 'completed' && (
            <Button
              size="sm"
              variant="success"
              onClick={() => handleStatusChange('completed')}
              disabled={isChangingStatus}
            >
              Mark Complete
            </Button>
          )}
          {task.status === 'pending' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleStatusChange('in-progress')}
              disabled={isChangingStatus}
            >
              Start Task
            </Button>
          )}
          {task.status === 'completed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange('pending')}
              disabled={isChangingStatus}
            >
              Reopen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
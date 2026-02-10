import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { setupDatabase } from '@/scripts/setupDatabase';
import { QuotationService } from '@/services/quotationService';

const DatabaseInitializer = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    approved: number;
    completed: number;
    rejected: number;
  } | null>(null);

  const handleInitializeDatabase = async () => {
    setStatus('loading');
    setMessage('Inicializando base de datos...');
    
    try {
      const success = await setupDatabase();
      
      if (success) {
        // Get updated stats
        const newStats = await QuotationService.getQuotationStats();
        setStats(newStats);
        setStatus('success');
        setMessage(`Base de datos inicializada exitosamente con ${newStats.total} cotizaciones de ejemplo.`);
      } else {
        setStatus('error');
        setMessage('Error al inicializar la base de datos. Revisa la consola para más detalles.');
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      setStatus('error');
      setMessage('Error inesperado al inicializar la base de datos.');
    }
  };

  const handleCheckStatus = async () => {
    setStatus('loading');
    setMessage('Verificando estado de la base de datos...');
    
    try {
      const result = await QuotationService.getQuotations(1, 0);
      const statsResult = await QuotationService.getQuotationStats();
      
      setStats(statsResult);
      
      if (result.quotations.length > 0) {
        setStatus('success');
        setMessage(`Base de datos activa con ${statsResult.total} cotizaciones.`);
      } else {
        setStatus('error');
        setMessage('Base de datos vacía. Necesita inicialización.');
      }
    } catch (error) {
      console.error('Database check error:', error);
      setStatus('error');
      setMessage('No se pudo conectar a la base de datos.');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Database className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getStatusIcon()}
          <span>Configuración de Base de Datos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Configura la base de datos Supabase con datos de ejemplo para el sistema de cotizaciones.
        </p>
        
        {message && (
          <div className={`p-3 rounded-lg border ${
            status === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            status === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {message}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3 bg-neutral-50 rounded-lg">
            <div className="text-center">
              <div className="font-bold text-lg">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-yellow-600">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-blue-600">{stats.approved}</div>
              <div className="text-xs text-muted-foreground">Aprobadas</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-green-600">{stats.completed}</div>
              <div className="text-xs text-muted-foreground">Completadas</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-red-600">{stats.rejected}</div>
              <div className="text-xs text-muted-foreground">Rechazadas</div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button 
            onClick={handleCheckStatus}
            disabled={status === 'loading'}
            variant="outline"
            size="sm"
          >
            Verificar Estado
          </Button>
          <Button 
            onClick={handleInitializeDatabase}
            disabled={status === 'loading'}
            className="bg-primary hover:bg-primary/90"
            size="sm"
          >
            {status === 'loading' ? 'Inicializando...' : 'Inicializar con Datos de Ejemplo'}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p><strong>Nota:</strong> Esta función poblará la base de datos con 10 cotizaciones de ejemplo usando los hospitales y cirujanos del sistema.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseInitializer;
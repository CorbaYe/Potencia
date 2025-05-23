from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import json

class Holiday(models.Model):
    date = models.DateField(unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.date})"

class Entrenadores(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=101)
    edad = models.PositiveSmallIntegerField()
    generos_lista = [("Masculino", "Masculino"), ("Femenino", "Femenino")]
    genero = models.CharField(max_length=10, choices=generos_lista)

    def __str__(self):
        return self.nombre
    
class Atletas(models.Model):
    id = models.AutoField(primary_key=True)
    documento = models.CharField(unique=True, max_length=100)
    nombre = models.CharField(max_length=100)
    edad = models.PositiveSmallIntegerField()
    generos_lista = [("Masculino", "Masculino"), ("Femenino", "Femenino")]
    genero = models.CharField(max_length=10, choices=generos_lista)
    arranque = models.CharField(max_length=3)
    envion = models.CharField(max_length=3)
    sentadilla_delante = models.CharField(max_length=3)
    sentadilla_detras = models.CharField(max_length=3)
    entrenador = models.ForeignKey(
        Entrenadores,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='atletas'
    )

    def __str__(self):
        return self.nombre
    
#mi cuenta
class Ejercicios(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=3)
    img = models.ImageField(upload_to='img/', verbose_name="Imagen", null=True)
    descripcion = models.TextField(verbose_name="Descripción", null=True)

    def __str__(self):
        return self.nombre
    
    def delete(self, using = None, keep_parents= False):
        self.img.storage.delete(self.img.name)
        super().delete()


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    foto_perfil = models.ImageField(upload_to='perfiles/', null=True, blank=True)

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def crear_perfil_usuario(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)   

@receiver(post_save, sender=User)
def guardar_perfil_usuario(sender, instance, **kwargs):
    try:
        instance.profile.save()
    except Profile.DoesNotExist:    
        Profile.objects.create(user=instance)
        
class Macrociclo(models.Model):
    entrenador = models.ForeignKey('Entrenadores', on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    total_dias = models.PositiveIntegerField()
    num_semanas = models.PositiveIntegerField()
    porcentaje_acumulacion = models.PositiveIntegerField()
    porcentaje_transformacion = models.PositiveIntegerField()
    porcentaje_realizacion = models.PositiveIntegerField()
    repeticiones_acumulacion = models.TextField()
    repeticiones_transformacion = models.TextField()
    repeticiones_realizacion = models.TextField()
    porcentajes_tecnico = models.TextField()  
    intensidades = models.TextField()
    
    def get_intensidades(self):
        return json.loads(self.intensidades)
    
    def __str__(self):
        return f"Macrociclo {self.id} - {self.entrenador.nombre}"
    
class Semana(models.Model):
    macrociclo = models.ForeignKey(Macrociclo, related_name='semanas', on_delete=models.CASCADE)
    iso_semana = models.PositiveIntegerField()
    iso_anio = models.PositiveIntegerField()
    inicio = models.DateField()
    fin = models.DateField()
    dias_entrenamiento = models.PositiveIntegerField()

    def __str__(self):
        return f"Semana {self.iso_semana} ({self.inicio} - {self.fin})"

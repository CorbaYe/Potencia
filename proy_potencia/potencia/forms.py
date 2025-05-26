from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, UsernameField
from .models import Entrenadores, Atletas, Ejercicios

from django.db.models.signals import post_save
from django.dispatch import receiver
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordChangeForm
from .models import Profile


class DaysForm(forms.Form):
    num_days = forms.IntegerField(label='Número de días', min_value=1)
    a_acumulacion = forms.IntegerField(required=True)
    t_transformacion = forms.IntegerField(required=True)
    r_realizacion = forms.IntegerField(required=True)

class RegistroEntrenadorForm(UserCreationForm):
    nombre = forms.CharField(
        max_length=100, 
        required=True, 
        label="Nombre completo",
        widget=forms.TextInput(attrs={'placeholder': 'Nombre completo'})
    )
    edad = forms.IntegerField(
        min_value=1, 
        required=True, 
        label="Edad",
        widget=forms.NumberInput(attrs={'placeholder': 'Edad'})
    )
    genero = forms.ChoiceField(
        choices=[("", "Género"), ("Masculino", "Masculino"), ("Femenino", "Femenino")],
        required=True, 
        label="Género",
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    correo = forms.EmailField(
        required=True, 
        label="Correo",
        widget=forms.EmailInput(attrs={'placeholder': 'Correo'})
    )

    class Meta:
        model = User
        fields = ('username', 'nombre', 'edad', 'genero', 'correo', 'password1', 'password2')
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'Usuario'}),
        }

    def clean_username(self):
        usuario = self.cleaned_data["username"]
        if User.objects.filter(username=usuario).exists():
            raise forms.ValidationError("El usuario ingresado ya está ocupado.")
        return usuario

    def clean_correo(self):
        correo = self.cleaned_data["correo"]
        if User.objects.filter(email=correo).exists():
            raise forms.ValidationError("Ese correo ya se encuetra registrado.")
        return correo

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["correo"]
        
        if commit:
            user.save()
            Entrenadores.objects.create(
                user=user,
                nombre=self.cleaned_data["nombre"],
                edad=self.cleaned_data["edad"],
                genero=self.cleaned_data["genero"],
            )
        return user

class AtletaForm(forms.ModelForm):
    class Meta:
        model = Atletas
        fields = ['documento', 'nombre', 'edad', 'genero', 'arranque', 'envion', 
                 'sentadilla_delante', 'sentadilla_detras', 'entrenador']
        widgets = {
            'documento': forms.TextInput(attrs={'class': 'form-control'}),
            'nombre': forms.TextInput(attrs={'class': 'form-control'}),
            'edad': forms.NumberInput(attrs={'class': 'form-control'}),
            'genero': forms.Select(attrs={'class': 'form-control'}),
            'arranque': forms.TextInput(attrs={'class': 'form-control'}),
            'envion': forms.TextInput(attrs={'class': 'form-control'}),
            'sentadilla_delante': forms.TextInput(attrs={'class': 'form-control'}),
            'sentadilla_detras': forms.TextInput(attrs={'class': 'form-control'}),
            'entrenador': forms.Select(attrs={'class': 'form-control'}),
        }

class EjerciciosForm(forms.ModelForm):
    class Meta:
        model = Ejercicios
        fields = ['codigo', 'nombre', 'img', 'descripcion']
        widgets = {
            'codigo': forms.TextInput(attrs={'class': 'form-control'}),
            'nombre': forms.TextInput(attrs={'class': 'form-control'}),
            'img': forms.FileInput(attrs={'class': 'form-control'}),
            'descripcion': forms.TextInput(attrs={'class': 'form-control'}),
        }

class EditarPerfilForm(forms.ModelForm):
    nombre = forms.CharField(
        max_length=100,
        required=True,
        label='Nombre completo',
        widget=forms.TextInput(attrs={'placeholder': 'Nombre completo'})
    )
    edad = forms.IntegerField(
        required=True,
        label='Edad',
        widget=forms.NumberInput(attrs={'placeholder': 'Edad'})
    )
    genero = forms.ChoiceField(
        choices=[("Masculino", "Masculino"), ("Femenino", "Femenino")],
        required=True,
        label='Género',
        widget=forms.Select()
    )
    foto_perfil = forms.ImageField(
        required=False,
        label='Foto de perfil',
        widget=forms.ClearableFileInput()
    )

    class Meta:
        model = User
        fields = ['username', 'email']
        labels = {
            'username': 'Nombre de usuario',
            'email': 'Correo electrónico',
        }

    def __init__(self, *args, **kwargs):
        self.entrenador = kwargs.pop('entrenador', None)
        self.perfil = kwargs.pop('perfil', None)
        super().__init__(*args, **kwargs)

        if self.entrenador:
            self.fields['nombre'].initial = self.entrenador.nombre
            self.fields['edad'].initial = self.entrenador.edad
            self.fields['genero'].initial = self.entrenador.genero

        if self.perfil:
            self.fields['foto_perfil'].initial = self.perfil.foto_perfil

    def save(self, commit=True):
        user = super().save(commit=False)

        if commit:
            user.save()

            if self.entrenador:
                self.entrenador.nombre = self.cleaned_data['nombre']
                self.entrenador.edad = self.cleaned_data['edad']
                self.entrenador.genero = self.cleaned_data['genero']
                self.entrenador.save()

            if self.perfil and self.cleaned_data.get('foto_perfil'):
                self.perfil.foto_perfil = self.cleaned_data['foto_perfil']
                self.perfil.save()

        return user



class EditarFotoPerfilForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['foto_perfil']

class PerfilForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username']

class FotoPerfilForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['foto_perfil']

class CustomPasswordChangeForm(PasswordChangeForm):
    old_password = forms.CharField(
        label="Contraseña actual",
        widget=forms.PasswordInput(attrs={'class': 'form-control'})
    )
    new_password1 = forms.CharField(
        label="Nueva contraseña",
        widget=forms.PasswordInput(attrs={'class': 'form-control'})
    )
    new_password2 = forms.CharField(
        label="Confirmar nueva contraseña",
        widget=forms.PasswordInput(attrs={'class': 'form-control'})
    )
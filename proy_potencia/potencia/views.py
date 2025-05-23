import datetime
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import logout
from django.utils import timezone
from .forms import DaysForm, RegistroEntrenadorForm, AtletaForm, EjerciciosForm
from .models import Holiday, Atletas, Ejercicios, Entrenadores
from .forms import PerfilForm, FotoPerfilForm, CustomPasswordChangeForm 
 
from django.http import JsonResponse


from .models import Holiday, Atletas, Ejercicios, Entrenadores, Macrociclo
import json
from django.forms.models import model_to_dict

def index(request):
    return render(request, 'index.html')

def registro(request):
    if request.method == "POST":
        form = RegistroEntrenadorForm(request.POST)
        if form.is_valid():
            form.save()                     
            messages.success(request, "¡Usuario creado correctamente, inicia sesión!")
            return redirect("login")  
        else:
            print(form.errors)
            messages.error(request, "Por favor verifique los campos marcados.")      
    else:
        form = RegistroEntrenadorForm()
    return render(request, "registration/registro.html", {"form": form})

def exit(request):
    logout(request)
    return redirect('index')


@login_required
def ejercicios(request):
    ejercicios = Ejercicios.objects.all()
    
    if request.method == 'POST':
        form = EjerciciosForm(request.POST, request.FILES)  
        if form.is_valid():
            form.save()
            return redirect('ejercicios')
    else:
        form = EjerciciosForm()
    
    return render(request, 'banco_ejercicios.html', {
        'ejercicios': ejercicios,
        'form': form,
        'editing': False
    })


@login_required
def editar_ejercicio(request, pk):
    ejercicio = get_object_or_404(Ejercicios, pk=pk)
    
    if request.method == 'POST':
        form = EjerciciosForm(request.POST, request.FILES, instance=ejercicio)  # ¡request.FILES importante!
        if form.is_valid():
            form.save()
            messages.success(request, f'Ejercicio {ejercicio.nombre} actualizado correctamente')
            return redirect('ejercicios')
    else:
        form = EjerciciosForm(instance=ejercicio)
    
    return render(request, 'banco_ejercicios.html', {
        'ejercicios': Ejercicios.objects.all(),
        'form': form,
        'editing': True,
        'ejercicio_edicion': ejercicio
    })

@login_required
def eliminar_ejercicio(request, pk):
    ejercicio = get_object_or_404(Ejercicios, pk=pk)
    
    if request.method == 'POST':
        ejercicio.delete()
        messages.success(request, f'Ejercicio {ejercicio.nombre} eliminado correctamente')
        return redirect('ejercicios')
    
    return render(request, 'banco_ejercicios.html', {
        'ejercicios': Ejercicios.objects.all(),
        'confirmar_eliminar': True,
        'ejercicio_a_eliminar': ejercicio
    })

@login_required
def planes(request):
    entrenador = request.user.entrenadores  
    macrociclos = entrenador.macrociclo_set.all()
    return render(request, 'planes.html', {
        'macrociclos': macrociclos
    })

@login_required
def eliminar_plan(request, pk):
    macrociclo = get_object_or_404(Macrociclo, pk=pk, entrenador=request.user.entrenadores)
    
    if request.method == 'POST':
        macrociclo_id = macrociclo.id
        macrociclo.delete()
        messages.success(request, f'Plan #{macrociclo_id} eliminado correctamente')
        return redirect('planes')
    
    return render(request, 'planes.html', {
        'macrociclo': Macrociclo.objects.all(),
        'confirmar_eliminar': True,
        'macrociclo_a_eliminar': macrociclo
    })



@login_required
def atletas(request):
    entrenador = request.user.entrenadores
    atletas = entrenador.atletas.all()
    form = AtletaForm(request.POST or None)

    if request.method == 'POST' and form.is_valid():
        form.save()
        return redirect('atletas')
    
    return render(request, 'atletas.html', {
        'atletas': atletas,
        'form': form,
        'editing': False
    })

@login_required
def editar_atleta(request, pk):
    atleta = get_object_or_404(Atletas, pk=pk)
    atletas_list = Atletas.objects.all()
    form = AtletaForm(request.POST or None, instance=atleta)
    
    if request.method == 'POST' and form.is_valid():
        form.save()
        return redirect('atletas')
    
    return render(request, 'atletas.html', {
        'atletas': atletas_list,
        'form': form,
        'editing': True,
        'atleta_edicion': atleta
    })

@login_required
def eliminar_atleta(request, pk):
    atleta = get_object_or_404(Atletas, pk=pk)
    
    if request.method == 'POST':
        atleta.delete()
        messages.success(request, f'Atleta {atleta.nombre} eliminado correctamente')
        return redirect('atletas')
    
    return render(request, 'atletas.html', {
        'atletas': Atletas.objects.all(),
        'confirmar_eliminar': True,
        'atleta_a_eliminar': atleta
    })

@login_required
def home(request):
    form = DaysForm()
    return render(request, 'home.html', {
        'form': form,
    })

@login_required
def microciclos(request):
    atletas = Atletas.objects.all()
    return render(request, 'microciclos.html', {'atletas': atletas})

@login_required
def macrociclos(request):
    results = None
    if request.method == 'POST':
        form = DaysForm(request.POST)
        if form.is_valid():
            accion = request.POST.get('accion')
            entrenador = Entrenadores.objects.get(user=request.user)
            total_days = form.cleaned_data['num_days']
            mensaje_alerta = ''
            weeks = []
            calculos_porcentaje = {
                'a_acumulacion': '',
                't_transformacion': '',
                'r_realizacion': ''
            }
            repeticiones_x_semana = {
                'repeticiones_acumulacion': '',
                'repeticiones_trasformacion': '',
                'repeticiones_realizacion': ''
            }
            if total_days >= 31 and total_days <= 98:
                repeticiones_acumulacion = form.cleaned_data['a_acumulacion']
                repeticiones_transformacion = form.cleaned_data['t_transformacion']
                repeticiones_realizacion= form.cleaned_data['r_realizacion']
                today = timezone.now().date()
                
                # Ajustar al próximo lunes si hoy no es lunes
                if today.weekday() != 0:
                    days_to_next_monday = (7 - today.weekday()) % 7
                    days_to_next_monday = days_to_next_monday or 7  # Asegurar que no sea cero
                    start_date = today + datetime.timedelta(days=days_to_next_monday)
                else:
                    start_date = today
                
                # Se define la fecha final según el total de días
                end_date = start_date + datetime.timedelta(days=total_days)
                
                # Obtener los festivos desde la BD y convertirlos a objeto date
                raw_holidays = Holiday.objects.values_list('date', flat=True)
                holidays = set()
                for h in raw_holidays:
                    if isinstance(h, datetime.datetime):
                        holidays.add(h.date())
                    else:
                        holidays.add(h)
                
                week_number = 1
                current_date = start_date
                
                # Recorrer cada semana (de lunes a viernes)
                while current_date < end_date:
                    week_working_days = []
                    for offset in range(5):  # lunes a viernes
                        day = current_date + datetime.timedelta(days=offset)
                        if day >= end_date:
                            break
                        # Si el día es festivo, se omite
                        if day in holidays:
                            continue
                        week_working_days.append(day)
                    
                    if week_working_days:
                        weeks.append({
                            'iso_week': week_number,
                            'iso_year': week_working_days[0].isocalendar()[0],
                            'start': week_working_days[0],
                            'end': week_working_days[-1],
                            'days_count': len(week_working_days)
                        })
                        week_number += 1
                    
                    # Avanzar al próximo lunes (sumamos 7 días)
                    current_date += datetime.timedelta(days=7)
                
                calculos_porcentaje = {
                    'a_acumulacion': round((len(weeks) * 0.4)),
                    't_transformacion': round((len(weeks) * 0.35)),
                    'r_realizacion': round((len(weeks) * 0.25)),
                }

                repeticiones_x_semana = {
                    'repeticiones_acumulacion': calculo_repeticiones_x_semana(calculos_porcentaje['a_acumulacion'], repeticiones_acumulacion, 'acumulacion'),
                    'repeticiones_trasformacion': calculo_repeticiones_x_semana(calculos_porcentaje['t_transformacion'], repeticiones_transformacion, 'transformacion'),
                    'repeticiones_realizacion': calculo_repeticiones_x_semana(calculos_porcentaje['r_realizacion'], repeticiones_realizacion, 'realizacion'),
                }
                # print(repeticiones_x_semana['repeticiones_acumulacion'])
            elif total_days > 98:
                mensaje_alerta = 'La cantidad de días excede la tiempo máximo para un ATR (3 meses y medio - 98 días)'
            else:
                mensaje_alerta = 'La cantidad de días no alcanza el tiempo mínimo requerido para un ATR (31 días)'     

            porcentajes_ejercicios = request.POST.get('porcentajes_ejercicios', '[]')
            intensidades = request.POST.get('intensidades', '{}')
            rep_acumulacion = request.POST.get('repet_acumulacion', '[]')
            rep_transformacion = request.POST.get('repet_transformacion', '[]')
            rep_realizacion = request.POST.get('repet_realizacion', '[]')

            results = {
                'weeks': weeks,
                'num_weeks': len(weeks),
                'porcentaje_acumulacion': calculos_porcentaje['a_acumulacion'],
                'porcentaje_transformacion': calculos_porcentaje['t_transformacion'],
                'porcentaje_realizacion': calculos_porcentaje['r_realizacion'],
                'total_days': total_days,
                'mensaje': mensaje_alerta,

                'repet_acumulacion': repeticiones_x_semana['repeticiones_acumulacion'],
                'repet_transformacion': repeticiones_x_semana['repeticiones_trasformacion'],
                'repet_realizacion': repeticiones_x_semana['repeticiones_realizacion']
            }
            if accion == 'guardar':
                macrociclo = Macrociclo.objects.create(
                    entrenador=entrenador,
                    total_dias=total_days,
                    num_semanas=len(weeks),
                    porcentaje_acumulacion = results['porcentaje_acumulacion'],
                    porcentaje_transformacion = results['porcentaje_transformacion'],
                    porcentaje_realizacion =  results['porcentaje_realizacion'],

                    repeticiones_acumulacion=rep_acumulacion,
                    repeticiones_transformacion=rep_transformacion,
                    repeticiones_realizacion=rep_realizacion,

                    porcentajes_tecnico=porcentajes_ejercicios,
                    intensidades=intensidades
                )
            #return redirect('detalle_macrociclo', macrociclo_id=macrociclo.id)
        
    return render(request, 'macrociclos.html', {
        'form': form, 
        'results': results
    })


@login_required
def detalle_macrociclo(request, macrociclo_id):
    macrociclo = get_object_or_404(
        Macrociclo, 
        id=macrociclo_id, 
        entrenador__user=request.user
    )
    context = {
        'macrociclo': macrociclo,
        'all_data': {
            'semanas': macrociclo.num_semanas,
            'porcentajes_atr': {
                'acumulacion': macrociclo.porcentaje_acumulacion,
                'transformacion': macrociclo.porcentaje_transformacion,
                'realizacion': macrociclo.porcentaje_realizacion
            },
            'repeticiones': {
                'acumulacion': json.loads(macrociclo.repeticiones_acumulacion),
                'transformacion': json.loads(macrociclo.repeticiones_transformacion),
                'realizacion': json.loads(macrociclo.repeticiones_realizacion)
            },
            'chart_porcentaje_fuerza_tecnica': {
                'labels': [f"Semana {i+1}" for i in range(macrociclo.num_semanas)],
                    'datasets':[
                        {
                        'label': '% Ejercicios Técnico',
                        'data': json.loads(macrociclo.porcentajes_tecnico)['% Ejercicios Técnico'],
                        'backgroundColor': 'rgba(255,206,86,0.6)',
                        'stack': 'Distribución'
                    },
                    {
                        'label': '% Ejercicios Fuerza',
                        'data': json.loads(macrociclo.porcentajes_tecnico)['% Ejercicios Fuerza'],
                        'backgroundColor': 'rgba(153,102,255,0.6)',
                        'stack': 'Distribución'
                    },
                    {
                        'label': 'Repeticiones totales',
                        'data':json.loads(macrociclo.porcentajes_tecnico)['Repeticiones totales'],
                        'borderColor': 'rgb(252, 255, 47)',
                        'type': 'line',
                        'borderWidth': 4,
                        'fill': False,
                        'yAxisID': 'y1'
                    },
                    {
                        'label': 'Cantidad ejercicios Técnicas',
                        'data': json.loads(macrociclo.porcentajes_tecnico)['Cantidad ejercicios Técnicas'],
                        'borderColor': 'rgba(143, 253, 0, 0.6)',
                        'type': 'line',
                        'borderWidth': 3,
                        'borderDash': [5,5],
                        'fill': False,
                        'yAxisID': 'y1'
                    },
                    {
                        'label': 'Cantidad ejercicios Fuerza',
                        'data': json.loads(macrociclo.porcentajes_tecnico)['Cantidad ejercicios Fuerza'],
                        'borderColor': 'rgba(38, 0, 255, 0.6)',
                        'type': 'line',
                        'borderWidth': 3,
                        'tension': 0.3,
                        'fill': False,
                        'yAxisID': 'y1'
                    }
                ]
            },
            'intensidades': json.loads(macrociclo.intensidades)
        }
    }
    return render(request, 'detalle_macrociclo.html', context)

def dashboard_halterofilia(request):
    return render(request, 'teoria.html')


#mi cuenta
from .forms import EditarPerfilForm, EditarFotoPerfilForm  # Asegúrate de importar estos formularios
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash

@login_required
def configuracion_cuenta(request):
    user = request.user
    entrenador = getattr(user, 'entrenadores', None)
    perfil = getattr(user, 'profile', None)

    if request.method == 'POST':
        perfil_form = EditarPerfilForm(request.POST, request.FILES, instance=user, entrenador=entrenador, perfil=perfil)
        password_form = PasswordChangeForm(request.user, request.POST)

        if perfil_form.is_valid():
            perfil_form.save()
            messages.success(request, 'Perfil actualizado correctamente.')

        if password_form.is_valid():
            user = password_form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Contraseña actualizada correctamente.')
        elif request.POST.get('old_password'):
            messages.error(request, 'Error al cambiar la contraseña. Verifica los datos ingresados.')

        return redirect('configuracion_cuenta')
    else:
        perfil_form = EditarPerfilForm(instance=user, entrenador=entrenador, perfil=perfil)
        password_form = PasswordChangeForm(request.user)

    for field in perfil_form.fields.values():
        field.widget.attrs.update({'class': 'form-control'})

    for field in password_form.fields.values():
        field.widget.attrs.update({'class': 'form-control'})

    return render(request, 'configuracion_cuenta.html', {
        'form': perfil_form,
        'foto_form': perfil_form,  # Ya no necesitas uno aparte
        'password_form': password_form,
    })



@login_required
def cambiar_contrasena_ajax(request):
    if request.method == 'POST':
        form = PasswordChangeForm(user=request.user, data=request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            return JsonResponse({'success': True, 'message': 'Contraseña actualizada correctamente.'})
        else:
            errors = {}
            for field in form.errors:
                errors[field] = form.errors[field].as_text()
            return JsonResponse({'success': False, 'errors': errors}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)






# mi cuenta

def diccionario_porcentajes_repeticiones(cantidad_semanas, repeticiones, tipo_fase):
    diccionario_porcentajes = {
        'acumulacion': {
            6: [0.166] * 6,
            5: [0.2] * 5,
            4: [0.26, 0.25, 0.25, 0.24],
            3: [0.35, 0.35, 0.30],
            2: [0.5, 0.5]
        },
        'transformacion': {
            5: [0.22, 0.2, 0.21, 0.2, 0.17],
            4: [0.26, 0.25, 0.25, 0.24],
            3: [0.35, 0.35, 0.30],
            2: [0.5, 0.5]
        },
        'realizacion': {
            4: [0.28, 0.30, 0.26, 0.16],
            3: [0.35, 0.35, 0.30],
            2: [0.5, 0.5]
        }
    }

    porcentajes = diccionario_porcentajes.get(tipo_fase, {}).get(cantidad_semanas, [1.0])
    return [round(repeticiones * i) for i in porcentajes]

def calculo_repeticiones_x_semana(cantidad_semanas, numero_repeticiones,fase):
    print(diccionario_porcentajes_repeticiones(cantidad_semanas, numero_repeticiones, fase))
    return diccionario_porcentajes_repeticiones(cantidad_semanas, numero_repeticiones, fase)
    

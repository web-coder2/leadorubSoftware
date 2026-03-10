<template>
    <h3>ОКК</h3>

    <el-form inline>
        <el-form-item label="Начало">
          <el-date-picker v-model="gte" type="date" style="width: 200px"/>
        </el-form-item>
        <el-form-item>
            <el-button type="success" @click="fetchLeads">Применить</el-button>
        </el-form-item>
    </el-form>

    <p>При обновление сохранении данных лидов ставьте флажок к колонке "Проверен" тем лидам которые проверил иначе они перезапишутся и статус вернется к нецелевой неважно целевой он или нет</p>

    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Дата"></el-table-column>
        <el-table-column prop="phone" label="Телефон"></el-table-column>
        <el-table-column prop="userName" label="Имя"></el-table-column>
        <el-table-column label="Прослушать">
            <template #default="{ row }">
                <el-button v-for="(audio, index) in row.audioArray" :key="index" circle plain type="warning" @click="playAudio(audio)">
                    <el-icon>
                        <VideoPlay></VideoPlay>
                    </el-icon>
                </el-button>
            </template>
        </el-table-column>
        <el-table-column prop="statusOKK" label="Статус ОКК">
            <template #default="{ row }">
                <p>{{ row.statusOKK ? 'Целевой' : 'Нецелевой' }}</p>
            </template>
        </el-table-column>
        <el-table-column prop="selfLead" label="Сам перевел">
            <template #default="{ row }">
                <p>{{ row.selfLead ? 'Сам' : 'На брокера' }}</p>
            </template>
        </el-table-column>
        <el-table-column prop="residenceStatus" label="Статус">
            <template #default="{ row }">
                <el-badge :value="row.residenceStatus" :type="getTypeOfBadge(row.residenceStatus)"></el-badge>
              </template>
        </el-table-column>
        <el-table-column label="Проверен">
            <template #default="{ row }">
                <el-checkbox v-model="row.isEdited"></el-checkbox>
            </template>
        </el-table-column>
        <el-table-column label="Установить">
            <template #default="{ row }">
              <el-select v-model="row.statusOKK" placeholder="Выберите статус" style="width: 120px;">
                <el-option :label="'Целевой'" :value="true"></el-option>
                <el-option :label="'Нецелевой'" :value="false"></el-option>
              </el-select>
            </template>
          </el-table-column>
    </el-table>

    <el-button type="success" @click="saveLeadsData">Сохранить данные</el-button>


    <div v-if="currentAudioUrl" style="margin-top: 20px; padding: 10px; border: 1px solid #dcdfe6; border-radius: 8px; display: flex; align-items: center; gap: 20px;">

        <el-button @click="togglePlay" type="primary" icon>
            <el-icon>
                <component :is="isPlaying ? 'VideoPlay' : 'VideoPause'" />
            </el-icon>
        </el-button>
        
        <el-slider v-model="progress" :max="duration" @change="seek" style="flex: 1;" tooltip="hover" tooltip-format="{value}s"></el-slider>
        
        <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
        
        <audio ref="audio" :src="currentAudioUrl"></audio>
    </div>

</template>

<script>

    import { ElButton, ElSlider } from 'element-plus'
    import { VideoPlay, VideoPause } from '@element-plus/icons-vue'
    import { ElMessage } from 'element-plus';


    import axios from 'axios'
    import dayjs from 'dayjs'

    export default {
    components: {
        ElButton,
        ElSlider,
        VideoPlay,
        VideoPause,
    },
    data() {
        return {
        tableData: [],
        gte: dayjs().format('YYYY-MM-DD'),
        currentAudioUrl: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        progress: 0,
        }
    },
    methods: {
        async fetchLeads() {
            const response = await axios.get('http://localhost:3000/api/leads/get', {
                params: {
                    gte: this.gte
                }
            })
            this.tableData = response.data.leads
        },
        async saveLeadsData() {
            const response = await axios.post('http://localhost:3000/api/leads/upsert', {
                leadsData: this.tableData
            })

            ElMessage({
                message: 'Лиды успешно изменены',
                type: 'success',
            });
        },
        getTypeOfBadge(status) {
            let type

            if (status === 'hold') {
                type = 'success'
            } else if (status === 'created') {
                type = 'info'
            } else if (status === 'invalid') {
                type = 'danger'
            } else if (status === 'breaked') {
                type = 'primary'
            }
            return type
        },
        playAudio(audioUrl) {
            this.currentAudioUrl = audioUrl

            console.log(this.currentAudioUrl)

            this.$nextTick(() => {
                const audio = this.$refs.audio
                audio.load()
                audio.play()
                this.isPlaying = true

                audio.ontimeupdate = () => {
                this.currentTime = audio.currentTime
                this.progress = audio.currentTime
                }
                audio.onloadedmetadata = () => {
                this.duration = audio.duration
                }
                audio.onended = () => {
                this.isPlaying = false
                }
            })
        },
        togglePlay() {
        const audio = this.$refs.audio
        if (!audio) return
        if (this.isPlaying) {
            audio.pause()
            this.isPlaying = false
        } else {
            audio.play()
            this.isPlaying = true
        }
        },
        seek() {
        const audio = this.$refs.audio
        if (audio) {
            audio.currentTime = this.progress
            if (!this.isPlaying) {
            audio.play()
            this.isPlaying = true
            }
        }
        },
        formatTime(seconds) {
            const min = Math.floor(seconds / 60)
            const sec = Math.floor(seconds % 60)
            return `${min}:${sec < 10 ? '0' + sec : sec}`
        },
    },
    async beforeMount() {
        await this.fetchLeads()
    }
    }
</script>